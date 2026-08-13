// 면접 페이지 봉인·해제.
// 브라우저의 Web Crypto(crypto.subtle)와 동일한 파라미터를 쓴다 —
// PBKDF2-HMAC-SHA256 으로 키를 만들고 AES-256-GCM 으로 암호화한 뒤,
// 암호문 뒤에 인증 태그를 붙여 저장한다(Web Crypto 가 기대하는 형태).
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from "node:crypto";

export const KDF = { name: "PBKDF2", hash: "SHA-256", iter: 310_000 };

const KEY_BYTES = 32;
const SALT_BYTES = 16;
const IV_BYTES = 12;
const TAG_BYTES = 16;

function deriveKey(password, salt, iter) {
  return pbkdf2Sync(password, salt, iter, KEY_BYTES, "sha256");
}

/** 평문 문자열 → 봉인 상자 { v, kdf{name,hash,iter,salt}, iv, ct } */
export function seal(plaintext, password) {
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", deriveKey(password, salt, KDF.iter), iv);
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);

  return {
    v: 1,
    kdf: { ...KDF, salt: salt.toString("base64") },
    iv: iv.toString("base64"),
    ct: Buffer.concat([body, cipher.getAuthTag()]).toString("base64"),
  };
}

/** 봉인 상자 → 평문 문자열. 비밀번호가 틀리거나 내용이 변조되면 throw 한다. */
export function unseal(box, password) {
  const salt = Buffer.from(box.kdf.salt, "base64");
  const iv = Buffer.from(box.iv, "base64");
  const raw = Buffer.from(box.ct, "base64");
  const body = raw.subarray(0, raw.length - TAG_BYTES);
  const tag = raw.subarray(raw.length - TAG_BYTES);

  const decipher = createDecipheriv("aes-256-gcm", deriveKey(password, salt, box.kdf.iter), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
}

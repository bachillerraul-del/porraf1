import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";

const ALG = "HS256";
const enc = new TextEncoder();
const key = () => enc.encode(process.env.AUTH_SECRET || "");

export async function signToken(payload, maxAgeSec = 60*60*24*30) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(await key());
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, await key(), { algorithms:[ALG] });
  return payload;
}

export function hashPin(pin, saltHex) {
  const salt = Buffer.from(saltHex, "hex");
  const hash = crypto.scryptSync(String(pin), salt, 32).toString("hex");
  return hash;
}
export function createSalt() {
  return crypto.randomBytes(16).toString("hex");
}
export function checkPin(storedHash, saltHex, pin) {
  const h = hashPin(pin, saltHex);
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(h, "hex"));
}

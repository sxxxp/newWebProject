import util from "util";
import crypto from "crypto";
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);
const createSalt = async () => {
  const buf = await randomBytesPromise(64);

  return buf.toString("base64");
};
const createHashedPassword = async (password: string) => {
  const salt = await createSalt();
  const num = parseInt(process.env.PASSWORD_HASH_KEY as string, 10);

  const key = await pbkdf2Promise(password, salt, num, 64, "sha512");
  const hashedPassword = key.toString("base64");

  return { hashedPassword, salt };
};

export { createHashedPassword };

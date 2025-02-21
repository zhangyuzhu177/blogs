import { registerAs } from "@nestjs/config";
import { parseIntRaw } from "utils";

export default registerAs('jwt', () => {
  const {
    JWT_LOGIN_AUTH_SECRET, JWT_LOGIN_AUTH_EXPIRE_IN_SECONDS,
  } = process.env

  return {
    loginAuthSecret: JWT_LOGIN_AUTH_SECRET,
    loginAuthExpireInSeconds: parseIntRaw(JWT_LOGIN_AUTH_EXPIRE_IN_SECONDS, 28800),
  }
});

import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
  return {
    loginAuthSecret: process.env.JWT_LOGIN_AUTH_SECRET,
    loginAuthExpireInSeconds: Number.parseInt(
      process.env.JWT_LOGIN_AUTH_EXPIRE_IN_SECONDS,
    ),
  }
});

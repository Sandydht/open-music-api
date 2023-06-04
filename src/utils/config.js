const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER,
  },
};

module.exports = config;

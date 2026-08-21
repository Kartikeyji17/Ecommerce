require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const ensureIndexes = require("./config/indexes");
const logger = require("./config/logger");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await ensureIndexes();
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});

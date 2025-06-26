import mongoose from "mongoose";
import chalk from "chalk";

/**
 * 连接数据库
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || null;

  if (!MONGODB_URI) {
    console.log(chalk.bgRed.black.bold(`未配置数据库连接地址`));
    return;
  }

  console.log(chalk.bgGreen.black.bold(`数据库连接中${MONGODB_URI}`));
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log(chalk.bgGreen.black.bold(`数据库连接成功${MONGODB_URI}`));
  } catch (e) {
    console.log(chalk.bgRed.black.bold(`数据库连接失败 ${e.message}`));
  }
};
export default connectDatabase;

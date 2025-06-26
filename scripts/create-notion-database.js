import dotenv from 'dotenv';
import notionService from '../src/services/notion.service.js';

// 加载环境变量
dotenv.config();

/**
 * 创建Notion数据库的独立脚本
 * 这个脚本会帮助用户自动创建微信消息数据库
 */

async function createDatabase() {
  console.log('🚀 Notion数据库创建工具');
  console.log('================================\n');

  // 检查必要的环境变量
  if (!process.env.NOTION_TOKEN) {
    console.error('❌ 错误: 未找到NOTION_TOKEN环境变量');
    console.log('💡 请先设置NOTION_TOKEN环境变量:');
    console.log('   1. 访问 https://www.notion.so/my-integrations');
    console.log('   2. 创建新的集成');
    console.log('   3. 复制Integration Token');
    console.log('   4. 在.env文件中设置 NOTION_TOKEN=你的token\n');
    return;
  }

  if (!process.env.NOTION_PARENT_PAGE_ID) {
    console.error('❌ 错误: 未找到NOTION_PARENT_PAGE_ID环境变量');
    console.log('💡 请先设置NOTION_PARENT_PAGE_ID环境变量:');
    console.log('   1. 在Notion中创建一个新页面（或使用现有页面）');
    console.log('   2. 复制页面URL中的32位字符串ID');
    console.log('   3. 在.env文件中设置 NOTION_PARENT_PAGE_ID=页面ID');
    console.log('   4. 确保已将集成添加到该页面的权限中\n');
    console.log('📝 页面URL示例: https://www.notion.so/workspace/页面名称-32位字符串');
    console.log('   其中32位字符串就是页面ID\n');
    return;
  }

  console.log('📋 配置检查:');
  console.log(`✅ NOTION_TOKEN: ${process.env.NOTION_TOKEN.substring(0, 10)}...`);
  console.log(`✅ NOTION_PARENT_PAGE_ID: ${process.env.NOTION_PARENT_PAGE_ID}`);
  console.log('');

  try {
    // 如果数据库已经存在，检查是否可以访问
    if (process.env.NOTION_DATABASE_ID && process.env.NOTION_DATABASE_ID !== 'your_notion_database_id_here') {
      console.log('⚠️  检测到已有数据库ID配置');
      console.log(`   当前数据库ID: ${process.env.NOTION_DATABASE_ID}`);
      console.log('   如果要创建新数据库，请先清空.env中的NOTION_DATABASE_ID\n');

      // 测试现有数据库
      try {
        await notionService.notion.databases.retrieve({
          database_id: process.env.NOTION_DATABASE_ID,
        });
        console.log('✅ 现有数据库连接正常，无需创建新数据库');
        return;
      } catch (error) {
        console.log('⚠️  现有数据库无法访问，将创建新数据库...\n');
      }
    }

    // 验证基本连接（不自动创建数据库）
    console.log('🔗 验证Notion连接...');
    if (!notionService.notion) {
      console.error('❌ Notion客户端未初始化');
      return;
    }

    // 测试集成权限
    try {
      await notionService.notion.users.me();
      console.log('✅ Notion集成验证成功');
    } catch (error) {
      console.error('❌ Notion集成验证失败:', error.message);
      return;
    }

    // 创建数据库
    console.log('🔨 开始创建数据库...');
    const databaseId = await notionService.createMessageDatabase();

    if (databaseId) {
      console.log('\n🎉 数据库创建成功！');
      console.log('================================');
      console.log(`📄 数据库ID: ${databaseId}`);
      console.log('');
      console.log('📝 下一步操作:');
      console.log('1. 将以下内容添加到你的.env文件:');
      console.log(`   NOTION_DATABASE_ID=${databaseId}`);
      console.log('');
      console.log('2. 重启你的应用程序');
      console.log('');
      console.log('3. 测试集成:');
      console.log('   npm run test:notion');
      console.log('');
      console.log('✨ 现在你的微信公众号消息将自动保存到Notion数据库中！');
    } else {
      console.error('❌ 数据库创建失败');
    }

  } catch (error) {
    console.error('❌ 创建过程中发生错误:', error.message);
    console.log('\n🔧 故障排除建议:');
    console.log('1. 检查NOTION_TOKEN是否正确');
    console.log('2. 检查NOTION_PARENT_PAGE_ID是否正确');
    console.log('3. 确保集成已添加到父页面的权限中');
    console.log('4. 检查网络连接');
  }
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log('🚀 Notion数据库创建工具');
  console.log('================================');
  console.log('');
  console.log('📖 使用说明:');
  console.log('1. 确保已在.env文件中配置NOTION_TOKEN');
  console.log('2. 确保已在.env文件中配置NOTION_PARENT_PAGE_ID');
  console.log('3. 运行此脚本创建数据库');
  console.log('');
  console.log('🔧 命令:');
  console.log('  npm run create:database  - 创建数据库');
  console.log('  node scripts/create-notion-database.js  - 直接运行脚本');
  console.log('');
  console.log('📋 环境变量说明:');
  console.log('  NOTION_TOKEN - Notion集成令牌');
  console.log('  NOTION_PARENT_PAGE_ID - 用于创建数据库的父页面ID');
  console.log('  NOTION_DATABASE_ID - 创建后的数据库ID（自动生成）');
  console.log('');
}

// 检查命令行参数
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  createDatabase();
}

export { createDatabase };

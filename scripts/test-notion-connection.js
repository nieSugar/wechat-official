import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

// 加载环境变量
dotenv.config();

/**
 * 测试Notion连接和权限的脚本
 */

function formatPageId(pageId) {
  if (!pageId) return pageId;
  
  // 移除所有连字符和空格
  const cleanId = pageId.replace(/[-\s]/g, '');
  
  // 如果长度不是32位，直接返回原值
  if (cleanId.length !== 32) {
    return pageId;
  }
  
  // 转换为UUID格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20, 32)}`;
}

async function testConnection() {
  console.log('🔍 Notion连接测试工具');
  console.log('================================\n');

  // 检查环境变量
  console.log('📋 环境变量检查:');
  console.log(`NOTION_TOKEN: ${process.env.NOTION_TOKEN ? '✅ 已设置' : '❌ 未设置'}`);
  console.log(`NOTION_PARENT_PAGE_ID: ${process.env.NOTION_PARENT_PAGE_ID ? '✅ 已设置' : '❌ 未设置'}`);
  
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_PARENT_PAGE_ID) {
    console.log('\n❌ 请先设置必要的环境变量');
    return;
  }

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const originalPageId = process.env.NOTION_PARENT_PAGE_ID;
  const formattedPageId = formatPageId(originalPageId);
  
  console.log(`\n📄 页面ID信息:`);
  console.log(`原始ID: ${originalPageId}`);
  console.log(`格式化ID: ${formattedPageId}`);

  try {
    // 测试1：验证集成token
    console.log('\n🔑 测试1: 验证集成token...');
    const user = await notion.users.me();
    console.log(`✅ 集成验证成功`);
    console.log(`   集成名称: ${user.name || '未知'}`);
    console.log(`   集成类型: ${user.type}`);

    // 测试2：尝试访问页面
    console.log('\n📖 测试2: 尝试访问页面...');
    try {
      const page = await notion.pages.retrieve({
        page_id: formattedPageId,
      });
      console.log('✅ 页面访问成功');
      console.log(`   页面标题: ${page.properties?.title?.title?.[0]?.text?.content || '无标题'}`);
      console.log(`   页面URL: ${page.url}`);
      
      // 测试3：尝试创建数据库
      console.log('\n🔨 测试3: 尝试创建测试数据库...');
      const database = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: formattedPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: '测试数据库 - 可以删除',
            },
          },
        ],
        properties: {
          '名称': {
            title: {},
          },
          '状态': {
            select: {
              options: [
                { name: '测试', color: 'blue' },
              ],
            },
          },
        },
      });
      
      console.log('✅ 测试数据库创建成功！');
      console.log(`   数据库ID: ${database.id}`);
      console.log(`   数据库URL: ${database.url}`);
      console.log('\n💡 现在你可以运行 npm run create:database 来创建正式的数据库');
      
    } catch (error) {
      if (error.code === 'object_not_found') {
        console.log('❌ 页面访问失败: 页面不存在或无权限访问');
        console.log('\n🔧 解决方案:');
        console.log('1. 检查页面ID是否正确');
        console.log('2. 确保页面存在且可访问');
        console.log('3. 在页面中点击"分享" -> "邀请" -> 添加你的集成');
        console.log('4. 给集成"可以编辑"权限');
      } else {
        console.log(`❌ 页面访问失败: ${error.message}`);
      }
    }

  } catch (error) {
    console.log(`❌ 集成验证失败: ${error.message}`);
    console.log('\n🔧 解决方案:');
    console.log('1. 检查NOTION_TOKEN是否正确');
    console.log('2. 确保集成仍然有效（未被删除）');
    console.log('3. 重新生成集成token');
  }
}

testConnection().catch(console.error);

/**
 * 指令系统演示脚本
 * 展示普通消息和 /ai 指令的不同处理逻辑
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3021';

/**
 * 模拟微信公众号发送XML消息
 */
async function sendWeChatMessage(content, fromUser = 'demo_user', toUser = 'demo_official') {
  const xmlMessage = `<xml>
  <ToUserName><![CDATA[${toUser}]]></ToUserName>
  <FromUserName><![CDATA[${fromUser}]]></FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
  <MsgId>${Date.now()}</MsgId>
</xml>`;

  try {
    console.log(`\n📤 发送消息: "${content}"`);
    
    const response = await axios.post(`${BASE_URL}/api/official`, xmlMessage, {
      headers: {
        'Content-Type': 'text/xml'
      }
    });
    
    // 提取回复内容
    const match = response.data.match(/<Content><!\[CDATA\[(.*?)\]\]><\/Content>/);
    const replyContent = match ? match[1] : '无法解析回复';
    
    console.log(`📥 AI回复: ${replyContent.substring(0, 100)}${replyContent.length > 100 ? '...' : ''}`);
    console.log('---');
    
    return replyContent;
  } catch (error) {
    console.error('❌ 发送消息失败:', error.message);
    return null;
  }
}

/**
 * 演示指令系统功能
 */
async function runDemo() {
  console.log('🎯 指令系统功能演示');
  console.log('='.repeat(50));
  
  console.log('\n📋 演示场景 1: 普通消息（会记录到Notion）');
  await sendWeChatMessage('你好，我想了解一下你的功能');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n📋 演示场景 2: /ai指令（不会记录到Notion）');
  await sendWeChatMessage('/ai 请简单介绍一下自己');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n📋 演示场景 3: 空的/ai指令');
  await sendWeChatMessage('/ai');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n📋 演示场景 4: 普通问题（会记录到Notion）');
  await sendWeChatMessage('今天是几号？');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('\n📋 演示场景 5: /ai指令带复杂问题（不会记录到Notion）');
  await sendWeChatMessage('/ai 解释一下人工智能的发展历程');
  
  console.log('\n✅ 演示完成！');
  console.log('\n💡 总结：');
  console.log('   • 普通消息：进行AI分析 + 记录到Notion数据库');
  console.log('   • /ai指令：仅进行AI回答，不记录到Notion数据库');
  console.log('   • 所有消息都会收到AI回复');
  console.log('\n📊 请检查Notion数据库，应该只有普通消息被记录');
}

// 检查服务器是否运行
async function checkServer() {
  try {
    await axios.get(BASE_URL);
    console.log('✅ 服务器运行正常');
    return true;
  } catch (error) {
    console.error('❌ 服务器未运行，请先启动服务器：node src/app.js');
    return false;
  }
}

// 运行演示
async function main() {
  if (await checkServer()) {
    await runDemo();
  }
}

main().catch(console.error);

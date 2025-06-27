/**
 * 指令处理工具模块
 * 处理类似Telegram的指令系统，支持不同的消息处理逻辑
 */

/**
 * 指令配置
 * 定义支持的指令及其处理方式
 */
const COMMANDS = {
  "/ai": {
    name: "AI回答",
    description: "仅进行AI回答，不记录到Notion",
    saveToNotion: false,
    processAI: true,
  },
};

/**
 * 解析用户输入的消息，检查是否包含指令
 * @param {string} content - 用户输入的消息内容
 * @returns {Object} 解析结果
 */
export const parseCommand = (content) => {
  if (!content || typeof content !== "string") {
    return {
      isCommand: false,
      command: null,
      actualContent: content,
      config: null,
    };
  }

  // 检查是否以指令前缀开始
  const trimmedContent = content.trim();

  // 查找匹配的指令
  for (const [commandKey, commandConfig] of Object.entries(COMMANDS)) {
    if (trimmedContent.startsWith(commandKey)) {
      // 提取指令后的实际内容
      const actualContent = trimmedContent.substring(commandKey.length).trim();

      return {
        isCommand: true,
        command: commandKey,
        actualContent: actualContent || "", // 如果指令后没有内容，返回空字符串
        config: commandConfig,
      };
    }
  }

  // 没有找到匹配的指令，按普通消息处理
  return {
    isCommand: false,
    command: null,
    actualContent: content,
    config: null,
  };
};

/**
 * 检查指令是否需要保存到Notion
 * @param {string} command - 指令名称
 * @returns {boolean} 是否需要保存到Notion
 */
export const shouldSaveToNotion = (command) => {
  if (!command || !COMMANDS[command]) {
    return true; // 默认保存普通消息
  }

  return COMMANDS[command].saveToNotion;
};

/**
 * 检查指令是否需要AI处理
 * @param {string} command - 指令名称
 * @returns {boolean} 是否需要AI处理
 */
export const shouldProcessAI = (command) => {
  if (!command || !COMMANDS[command]) {
    return true; // 默认处理普通消息
  }

  return COMMANDS[command].processAI;
};

/**
 * 获取所有支持的指令列表
 * @returns {Object} 指令配置对象
 */
export const getSupportedCommands = () => {
  return COMMANDS;
};

/**
 * 生成帮助信息
 * @returns {string} 帮助文本
 */
export const generateHelpText = () => {
  let helpText = "🤖 支持的指令：\n\n";

  for (const [command, config] of Object.entries(COMMANDS)) {
    helpText += `${command} - ${config.description}\n`;
  }

  helpText += "\n💡 使用方法：\n";
  helpText += '• 发送 "/ai 你的问题" 进行AI对话（不记录）\n';
  helpText += "• 直接发送消息进行AI分析并记录到数据库\n";

  return helpText;
};

export default {
  parseCommand,
  shouldSaveToNotion,
  shouldProcessAI,
  getSupportedCommands,
  generateHelpText,
};

# 微信公众号指令系统

## 功能概述

本系统实现了类似 Telegram 的指令功能，支持不同类型的消息处理逻辑：

- **普通消息**：进行 AI 分析并记录到 Notion 数据库
- **`/ai` 指令**：仅进行 AI 回答，不记录到 Notion 数据库

## 指令列表

### `/ai` - AI 对话指令

**用法**：`/ai [问题内容]`

**功能**：
- 仅进行 AI 回答，不会将消息记录到 Notion 数据库
- 适用于临时咨询、测试或不希望被记录的对话

**示例**：
```
/ai 今天天气怎么样？
/ai 请告诉我一个笑话
/ai 解释一下量子物理学
```

**注意**：如果只发送 `/ai` 而没有问题内容，系统会提示正确的使用方法。

## 消息处理逻辑

### 普通消息处理流程

1. 用户发送普通消息（不以 `/` 开头）
2. 系统进行 AI 分析和回复
3. 将消息和回复记录到 Notion 数据库
4. 返回 AI 回复给用户

### `/ai` 指令处理流程

1. 用户发送 `/ai` 指令消息
2. 系统解析指令，提取实际问题内容
3. 仅进行 AI 分析和回复
4. **不记录**到 Notion 数据库
5. 在控制台记录指令处理日志
6. 返回 AI 回复给用户

## 技术实现

### 核心文件

- `src/utils/command.util.js` - 指令解析和处理工具
- `src/services/official.service.js` - 消息处理服务（已更新）
- `src/services/notion.service.js` - Notion 数据库服务（已更新）

### 指令解析

系统使用 `parseCommand()` 函数解析用户输入：

```javascript
const result = parseCommand(userInput);
// 返回：
// {
//   isCommand: boolean,     // 是否为指令
//   command: string,        // 指令类型 ('/ai' 等)
//   actualContent: string,  // 实际内容（去除指令前缀）
//   config: object         // 指令配置
// }
```

### Notion 数据库字段

更新后的 Notion 数据库包含以下字段：

- **消息内容** (Title) - 用户发送的原始消息
- **消息类型** (Select) - text/image/video 等
- **AI回复** (Rich Text) - AI 生成的回复内容
- **是否指令** (Checkbox) - 标识是否为指令消息
- **指令类型** (Select) - 指令类型或"普通消息"
- **创建时间** (Date) - 消息接收时间

## 使用示例

### 示例 1：普通消息（会记录到 Notion）

**用户输入**：`今天天气怎么样？`

**系统行为**：
- ✅ 进行 AI 分析
- ✅ 记录到 Notion 数据库
- ✅ 返回 AI 回复

### 示例 2：`/ai` 指令（不会记录到 Notion）

**用户输入**：`/ai 请告诉我一个笑话`

**系统行为**：
- ✅ 进行 AI 分析（仅处理"请告诉我一个笑话"）
- ❌ 不记录到 Notion 数据库
- ✅ 返回 AI 回复
- ✅ 在控制台记录处理日志

### 示例 3：空 `/ai` 指令

**用户输入**：`/ai`

**系统行为**：
- ❌ 不进行 AI 分析
- ❌ 不记录到 Notion 数据库
- ✅ 返回使用提示

## 扩展指令

系统设计支持轻松添加新指令。在 `src/utils/command.util.js` 中的 `COMMANDS` 对象添加新指令：

```javascript
const COMMANDS = {
  '/ai': {
    name: 'AI回答',
    description: '仅进行AI回答，不记录到Notion',
    saveToNotion: false,
    processAI: true
  },
  '/help': {
    name: '帮助',
    description: '显示帮助信息',
    saveToNotion: true,
    processAI: false
  }
  // 添加更多指令...
};
```

## 测试

项目包含测试脚本验证指令功能：

- `test-command.js` - 完整的消息处理测试
- `simple-test.js` - 简单的功能验证
- `test-command-parsing.js` - 指令解析功能测试

运行测试：
```bash
node test-command.js
```

## 日志记录

- **普通消息**：记录到 Notion 数据库
- **指令消息**：在控制台输出处理日志，格式如下：
  ```
  🤖 指令处理 [/ai]: 请告诉我一个笑话 -> 当然可以！希望这个笑话能让你开心一下...
  ```

## 注意事项

1. **环境变量**：确保正确配置 Notion 相关环境变量
2. **数据库更新**：如果使用现有 Notion 数据库，需要手动添加新字段
3. **指令大小写**：指令区分大小写，必须使用小写
4. **性能考虑**：`/ai` 指令减少了数据库写入，提高响应速度

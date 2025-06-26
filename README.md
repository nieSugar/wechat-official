# 微信公众号服务

## 项目简介

这是一个用于处理微信公众号消息和事件的Node.js服务端应用。本服务实现了微信公众平台的服务器配置验证、消息接收与处理等基础功能，并集成了OpenAI接口实现智能聊天回复，为微信公众号提供全面的后端支持。

## 线上案例

扫描下方二维码，体验智能聊天机器人：

![微信公众号二维码](doc/images/qrcode_for_gh_81fce9bef0a9_344.jpg)


## 接口测试地址
[https://wechat-official.vercel.app(科学上网访问)](https://wechat-official.vercel.app)

## 主要功能

1. **服务器配置验证**：实现微信公众平台要求的服务器配置验证流程
2. **消息接收与解析**：接收并解析微信公众号发来的XML格式消息
3. **AI智能回复**：集成OpenAI API，为用户提供智能聊天回复功能
4. **消息格式转换**：支持XML和JSON格式的消息转换

## 技术栈

- **后端框架**：Node.js + Express.js (^4.21.2)
- **AI服务**：OpenAI API (^4.87.3)
- **消息处理**：fast-xml-parser (^5.2.2)
- **HTTP请求**：axios (^1.8.3)
- **时间处理**：dayjs (^1.11.13)
- **环境变量**：dotenv (^16.5.0)
- **开发工具**：nodemon (热重载)

## 项目结构

```
├── src/                        # 源代码目录
│   ├── app.js                  # 应用入口文件
│   ├── config/                 # 配置文件目录
│   │   └── dbConfig.js         # 数据库配置文件
│   ├── controllers/            # 控制器目录
│   │   ├── official.controller.js  # 微信公众号相关控制器
│   │   └── ai.controller.js    # AI相关控制器
│   ├── data/                   # 数据配置目录
│   │   └── command.config.js   # 命令配置文件
│   ├── models/                 # 数据模型目录
│   │   └── message.model.js    # 消息数据模型
│   ├── routes/                 # 路由目录
│   │   ├── main.router.js      # 主路由
│   │   ├── api.router.js       # API路由
│   │   └── modules/            # 功能模块路由
│   │       ├── official.router.js  # 微信公众号路由
│   │       └── ai.router.js    # AI相关路由
│   ├── services/               # 服务层目录
│   │   └── official.service.js # 微信公众号业务逻辑处理
│   ├── utils/                  # 工具函数目录
│   │   ├── aiReply.util.js     # AI回复工具函数
│   │   └── douyin.util.js      # 抖音相关工具函数
│   └── view/                   # 视图目录（暂为空）
├── public/                     # 公共资源目录
│   └── index.html              # 首页文件
├── doc/                        # 文档目录
│   └── images/                 # 图片资源目录
│       └── qrcode_for_gh_81fce9bef0a9_344.jpg  # 公众号二维码
├── .cursorrules                # Cursor编辑器规则配置
├── .gitignore                  # Git忽略文件配置
├── package.json                # 项目依赖配置
├── package-lock.json           # 依赖锁定文件
├── vercel.json                 # Vercel部署配置
└── README.md                   # 项目说明文档
```

## 环境要求

- Node.js >= 18.x
- 微信公众号账号
- OpenAI API密钥

## 环境变量配置

项目使用.env文件管理环境变量，需要创建.env文件并配置以下内容：

```
# 服务配置
PORT=3001                     # 服务运行端口

# 微信公众号配置
OFFICIAL_TOKEN=your_token     # 微信公众平台配置的Token

# OpenAI配置
AI_API_KEY=your_openai_key    # OpenAI API密钥
AI_API_URL=https://api.openai.com/v1  # OpenAI API URL，可自定义
AI_MODEL=gpt-3.5-turbo        # 使用的AI模型
```

## 安装与运行

```bash
# 克隆项目
git clone https://your-repository-url/wechat-official.git
cd wechat-official

# 安装依赖
npm install

# 配置环境变量
# 创建.env文件，并填写必要的配置信息 参照.env.example

# 开发模式运行
npm run dev
```

## 微信公众号配置

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入"设置与开发" -> "基本配置"
3. 在服务器配置项中填写：
   - URL: `http://你的域名/api/official`
   - Token: 与环境变量OFFICIAL_TOKEN一致
   - EncodingAESKey: 可选，用于加密模式
4. 点击"提交"按钮，验证服务器配置

## 功能说明

### AI智能回复

本项目集成了OpenAI API实现智能聊天功能。当用户向公众号发送文本消息时，系统将：

1. 接收并解析用户消息
2. 通过OpenAI API获取智能回复
3. 将回复内容封装为微信公众号支持的XML格式
4. 发送回复给用户

### 消息处理流程

```
用户 -> 微信服务器 -> 本服务 -> AI处理 -> 本服务 -> 微信服务器 -> 用户
```

## 二次开发指南

如需扩展功能，可在以下位置进行修改：

1. **添加新的消息类型处理**：修改`src/controllers/official.controller.js`中的`receiveMessages`函数
2. **自定义AI回复逻辑**：修改`src/services/official.service.js`中的`textMessageProcessing`函数
3. **添加新的API endpoints**：在`src/routes/modules/`目录下创建新的路由文件
4. **修改AI提示词**：调整`src/utils/aiReply.util.js`中的AI系统提示词

## 编写代码时：
    - 使用ESM模块语法。
    - 新增路由时路由名称为名称加Router后缀，例如：user.router.js，这样便于区分路由和控制器。
    - 新增控制器时控制器名称为名称加Controller后缀，例如：user.controller.js。
    - 新增模型时模型名称为名称加Model后缀，例如：userModel.js。
    - 新增中间件时中间件名称为名称加Middleware后缀，例如：user.middleware.js。
    - 新增工具时工具名称为名称加Util后缀，例如：user.util.js。
    - 新增服务时服务名称为名称加Service后缀，例如：user.service.js。

## 常见问题

1. **验证失败**：检查Token配置是否一致，URL是否可以正常访问
2. **无法收到回复**：检查OpenAI API密钥是否有效，网络连接是否正常
3. **响应超时**：考虑优化AI请求逻辑，或增加异步处理机制


## 许可证

ISC

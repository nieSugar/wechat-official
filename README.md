# 微信公众号服务

## 项目简介

这是一个用于处理微信公众号消息和事件的Node.js服务端应用。本服务实现了微信公众平台的服务器配置验证、消息接收与处理等基础功能，为微信公众号提供后端支持。

## 主要功能

1. **服务器配置验证**：实现微信公众平台要求的服务器配置验证流程
2. **消息接收与解析**：接收并解析微信公众号发来的XML格式消息
3. **消息回复**：提供消息回复功能，支持文本消息回复

## 技术栈

- Node.js
- Express.js - Web服务框架
- XML解析库 - 使用fast-xml-parser和xml2js处理XML格式数据
- Crypto - 用于加密验证
- Dotenv - 环境变量管理

## 项目结构

```
├── src/                      # 源代码目录
│   ├── app.js                # 应用入口文件
│   ├── controllers/          # 控制器目录
│   │   └── official.controller.js  # 微信公众号相关控制器
│   └── routes/               # 路由目录
│       ├── main.router.js    # 主路由
│       ├── api.router.js     # API路由
│       └── modules/          # 功能模块路由
│           └── official.router.js  # 微信公众号路由
├── package.json              # 项目依赖配置
└── README.md                 # 项目说明文档
```

## 环境要求

- Node.js >= 14.x
- npm >= 6.x

## 环境变量配置

项目使用.env文件管理环境变量，需要创建.env文件并配置以下内容：

```
PORT=3001                     # 服务运行端口
OFFICIAL_TOKEN=your_token     # 微信公众平台配置的Token
```

## 安装与运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev
```

## 微信公众号配置

1. 登录微信公众平台
2. 进入"设置与开发" -> "基本配置"
3. 在服务器配置项中填写：
   - URL: `http://你的域名/api/official`
   - Token: 与环境变量OFFICIAL_TOKEN一致
   - EncodingAESKey: 可选，用于加密模式

## 二次开发指南

如需扩展功能，可在以下位置进行修改：

1. **添加新的消息处理逻辑**：修改`src/controllers/official.controller.js`中的`receiveMessages`函数
2. **添加新的API endpoints**：在`src/routes/modules/`目录下创建新的路由文件

## 许可证

ISC

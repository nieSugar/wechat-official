import { Client } from '@notionhq/client';
import dayjs from 'dayjs';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * Notion服务类
 * 用于连接Notion API并操作数据库
 */
class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
    this.parentPageId = this.formatPageId(process.env.NOTION_PARENT_PAGE_ID); // 用于创建数据库的父页面ID
  }

  /**
   * 格式化页面ID，确保符合Notion API要求的UUID格式
   * @param {string} pageId - 原始页面ID
   * @returns {string} 格式化后的页面ID
   */
  formatPageId(pageId) {
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

  /**
   * 创建微信消息数据库
   * @returns {Promise<string|null>} 返回创建的数据库ID
   */
  async createMessageDatabase() {
    try {
      if (!this.notion) {
        console.error('❌ Notion客户端未初始化');
        return null;
      }

      if (!this.parentPageId) {
        console.error('❌ 缺少NOTION_PARENT_PAGE_ID环境变量，无法创建数据库');
        console.log('💡 请在Notion中创建一个页面，并将页面ID设置为NOTION_PARENT_PAGE_ID环境变量');
        return null;
      }

      console.log('🔨 正在创建微信消息数据库...');

      const database = await this.notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: this.parentPageId,
        },
        title: [
          {
            type: 'text',
            text: {
              content: '公众号消息记录',
            },
          },
        ],
        properties: {
          // 消息内容 (Title类型，作为主要标识)
          '消息内容': {
            title: {},
          },
          // 消息类型
          '消息类型': {
            select: {
              options: [
                { name: 'text', color: 'blue' },
                { name: 'image', color: 'green' },
                { name: 'video', color: 'purple' },
                { name: 'voice', color: 'orange' },
                { name: 'location', color: 'red' },
                { name: 'link', color: 'yellow' },
                { name: 'event', color: 'gray' },
              ],
            },
          },
          // AI回复内容
          'AI回复': {
            rich_text: {},
          },
          // 是否为指令
          '是否指令': {
            checkbox: {},
          },
          // 指令类型
          '指令类型': {
            select: {
              options: [
                { name: '/ai', color: 'purple' },
                { name: '/help', color: 'blue' },
                { name: '普通消息', color: 'default' },
              ],
            },
          },
          // 创建时间
          '创建时间': {
            date: {},
          },
        },
      });

      console.log('✅ 数据库创建成功!');
      console.log('📄 数据库ID:', database.id);
      console.log('🔗 数据库URL:', database.url);
      console.log('💡 请将数据库ID设置为NOTION_DATABASE_ID环境变量');

      return database.id;
    } catch (error) {
      console.error('❌ 创建数据库失败:', error.message);
      if (error.code === 'object_not_found') {
        console.log('💡 请检查NOTION_PARENT_PAGE_ID是否正确，并确保集成有访问该页面的权限');
      }
      return null;
    }
  }

  /**
   * 验证Notion连接和数据库配置
   * @param {boolean} autoCreate - 是否自动创建数据库（默认false）
   * @returns {Promise<boolean>}
   */
  async validateConnection(autoCreate = false) {
    try {
      if (!this.notion) {
        console.error('❌ Notion配置缺失: 请检查NOTION_TOKEN环境变量');
        return false;
      }

      // 如果没有数据库ID
      if (!this.databaseId) {
        if (autoCreate) {
          console.log('⚠️  未找到NOTION_DATABASE_ID，尝试创建新数据库...');
          const newDatabaseId = await this.createMessageDatabase();
          if (newDatabaseId) {
            this.databaseId = newDatabaseId;
            console.log('✅ 数据库创建成功，请将以下ID添加到.env文件:');
            console.log(`NOTION_DATABASE_ID=${newDatabaseId}`);
            return true;
          } else {
            return false;
          }
        } else {
          console.log('⚠️  未找到NOTION_DATABASE_ID，请先创建数据库');
          return false;
        }
      }

      // 测试数据库访问权限
      await this.notion.databases.retrieve({
        database_id: this.databaseId,
      });

      console.log('✅ Notion连接验证成功');
      return true;
    } catch (error) {
      console.error('❌ Notion连接验证失败:', error.message);
      if (error.code === 'object_not_found') {
        if (autoCreate) {
          console.log('💡 数据库不存在或无权访问，尝试创建新数据库...');
          const newDatabaseId = await this.createMessageDatabase();
          if (newDatabaseId) {
            this.databaseId = newDatabaseId;
            console.log('✅ 数据库创建成功，请将以下ID添加到.env文件:');
            console.log(`NOTION_DATABASE_ID=${newDatabaseId}`);
            return true;
          }
        } else {
          console.log('💡 数据库不存在或无权访问');
        }
      }
      return false;
    }
  }

  /**
   * 保存用户消息到Notion数据库
   * @param {Object} messageData - 消息数据
   * @param {string} messageData.content - 消息内容
   * @param {string} messageData.msgType - 消息类型 (text/image/video等)
   * @param {string} messageData.aiReply - AI回复内容
   * @param {Date} messageData.timestamp - 消息时间戳
   * @param {boolean} messageData.isCommand - 是否为指令
   * @param {string} messageData.command - 指令类型
   * @returns {Promise<Object|null>}
   */
  async saveMessage(messageData) {
    try {
      if (!await this.validateConnection(true)) {
        return null;
      }

      const {
        content,
        msgType,
        aiReply,
        timestamp,
        isCommand = false,
        command = null
      } = messageData;

      // 构建属性对象
      const properties = {
        // 消息内容
        '消息内容': {
          title: [
            {
              text: {
                content: content || '空消息',
              },
            },
          ],
        },
        // 消息类型
        '消息类型': {
          select: {
            name: msgType || 'text',
          },
        },
        // AI回复内容
        'AI回复': {
          rich_text: [
            {
              text: {
                content: aiReply || '无回复',
              },
            },
          ],
        },
        // 是否为指令
        '是否指令': {
          checkbox: isCommand,
        },
        // 指令类型
        '指令类型': {
          select: {
            name: isCommand ? (command || '/unknown') : '普通消息',
          },
        },
        // 创建时间
        '创建时间': {
          date: {
            start: dayjs(timestamp).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          },
        },
      };

      const response = await this.notion.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties,
      });

      const logMessage = isCommand
        ? `✅ 指令消息已保存到Notion [${command}]: ${response.id}`
        : `✅ 普通消息已保存到Notion: ${response.id}`;
      console.log(logMessage);

      return response;
    } catch (error) {
      console.error('❌ 保存消息到Notion失败:', error.message);
      return null;
    }
  }

  /**
   * 查询Notion数据库中的消息记录
   * @param {Object} filters - 查询过滤条件
   * @param {number} filters.limit - 返回记录数量限制
   * @returns {Promise<Array>}
   */
  async queryMessages(filters = {}) {
    try {
      if (!await this.validateConnection(true)) {
        return [];
      }

      const { limit = 10 } = filters;

      const queryOptions = {
        database_id: this.databaseId,
        page_size: limit,
        sorts: [
          {
            property: '创建时间',
            direction: 'descending',
          },
        ],
      };

      const response = await this.notion.databases.query(queryOptions);

      return response.results.map(page => ({
        id: page.id,
        content: page.properties['消息内容']?.title?.[0]?.text?.content || '',
        msgType: page.properties['消息类型']?.select?.name || '',
        timestamp: page.properties['创建时间']?.date?.start || '',
        createdTime: page.created_time,
      }));
    } catch (error) {
      console.error('❌ 查询Notion数据库失败:', error.message);
      return [];
    }
  }

  /**
   * 获取数据库统计信息
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      if (!await this.validateConnection(true)) {
        return null;
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
      });

      const stats = {
        totalMessages: response.results.length,
        messageTypes: {},
        dailyStats: {},
      };

      response.results.forEach(page => {
        // 统计消息类型
        const msgType = page.properties['消息类型']?.select?.name || 'unknown';
        stats.messageTypes[msgType] = (stats.messageTypes[msgType] || 0) + 1;

        // 统计每日消息数量
        const date = dayjs(page.created_time).format('YYYY-MM-DD');
        stats.dailyStats[date] = (stats.dailyStats[date] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('❌ 获取统计信息失败:', error.message);
      return null;
    }
  }
}

// 创建单例实例
const notionService = new NotionService();

export default notionService;

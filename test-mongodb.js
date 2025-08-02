#!/usr/bin/env node
/**
 * MongoDB 连接测试脚本
 */

const mongoose = require('mongoose');

// 测试 MongoDB 连接
async function testMongoConnection(mongoUri) {
    try {
        console.log('🔌 正在连接 MongoDB...');
        console.log('连接地址:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB 连接成功！');
        
        // 测试创建集合和文档
        const testSchema = new mongoose.Schema({
            message: String,
            timestamp: { type: Date, default: Date.now }
        });
        
        const TestModel = mongoose.model('Test', testSchema);
        
        // 插入测试数据
        const testDoc = new TestModel({
            message: 'MongoDB 连接测试成功'
        });
        
        const saved = await testDoc.save();
        console.log('✅ 测试数据插入成功:', saved);
        
        // 查询测试数据
        const found = await TestModel.findById(saved._id);
        console.log('✅ 测试数据查询成功:', found);
        
        // 删除测试数据
        await TestModel.findByIdAndDelete(saved._id);
        console.log('✅ 测试数据清理完成');
        
        console.log('🎉 MongoDB 数据库测试完全通过！');
        
    } catch (error) {
        console.error('❌ MongoDB 连接失败:', error.message);
        if (error.message.includes('authentication failed')) {
            console.log('💡 提示：请检查用户名和密码是否正确');
        }
        if (error.message.includes('network')) {
            console.log('💡 提示：请检查网络连接和IP白名单设置');
        }
    } finally {
        await mongoose.disconnect();
        console.log('🔌 数据库连接已关闭');
    }
}

// 从命令行参数获取连接字符串
const mongoUri = process.argv[2];

if (!mongoUri) {
    console.log('用法: node test-mongodb.js "你的MongoDB连接字符串"');
    console.log('示例: node test-mongodb.js "mongodb+srv://zhangaa802:你的密码@cluster0.twgfyce.mongodb.net/vibe-meeting?retryWrites=true&w=majority&appName=Cluster0"');
    process.exit(1);
}

testMongoConnection(mongoUri);
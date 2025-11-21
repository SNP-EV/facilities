const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 数据文件路径
const dataDir = './data';
const dataFile = path.join(dataDir, 'equipment.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// 初始化默认数据
const defaultData = {
    buildingData: {
        "1": { 
            name: "1号楼", 
            floors: [
                { id: "1-1", name: "地下制冷机房", description: "中央空调制冷设备" },
                { id: "1-2", name: "一层", description: "办公区与接待区" },
                { id: "1-3", name: "一夹层", description: "设备间与储藏室" },
                { id: "1-4", name: "二层", description: "办公区与会议室" },
                { id: "1-5", name: "二夹层", description: "档案室与设备间" },
                { id: "1-6", name: "屋顶", description: "通风设备与太阳能板" }
            ] 
        },
        "2": { 
            name: "2号楼", 
            floors: [
                { id: "2-1", name: "地下消防泵房", description: "消防水泵与控制系统" },
                { id: "2-2", name: "门卫室", description: "安保设备与监控" },
                { id: "2-3", name: "消防屋", description: "消防器材存放" },
                { id: "2-4", name: "工程屋", description: "工程设备与工具" },
                { id: "2-5", name: "杂物间", description: "杂物存放" }
            ] 
        },
        "3": { name: "3号楼", floors: [] },
        "4": { name: "4号楼", floors: [] },
        "5": { name: "5号楼", floors: [] },
        "6": { name: "6号楼", floors: [] },
        "7": { name: "7号楼", floors: [] },
        "8": { name: "8号楼", floors: [] },
        "outdoor": { name: "室外区域", floors: [] }
    },
    equipmentData: {}
};

// 读取数据
function readData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            console.log('从文件读取数据成功');
            return data;
        }
    } catch (error) {
        console.error('读取数据文件失败:', error);
    }
    console.log('使用默认数据');
    return defaultData;
}

// 保存数据
function saveData(data) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        console.log('数据保存成功');
        return true;
    } catch (error) {
        console.error('保存数据失败:', error);
        return false;
    }
}

// API路由 - 获取数据
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// API路由 - 保存数据
app.post('/api/data', (req, res) => {
    if (saveData(req.body)) {
        res.json({ success: true, message: '数据保存成功' });
    } else {
        res.status(500).json({ success: false, message: '数据保存失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🎉 设备管理系统启动成功！');
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`📁 数据文件: ${dataFile}`);
    console.log('💡 按 Ctrl+C 停止服务器');
});
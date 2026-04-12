// ================= 1. 选项卡切换逻辑 =================
function switchTab(tabId) {
    // 隐藏所有内容
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(el => el.classList.remove('active'));
    // 显示目标
    document.getElementById('tab-' + tabId).classList.add('active');
    
    // 更新底部导航高亮
    const items = document.querySelectorAll('.nav-item');
    items.forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // 如果切回雷达图，重新绘制动画
    if(tabId === 'radar') {
        drawRadarChart();
    }
}

// ================= 2. 原生 Canvas 绘制雷达图引擎 =================
function drawRadarChart() {
    const canvas = document.getElementById('radarCanvas');
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 基础配置项
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;
    const sides = 5;
    const labels = ['传统技艺', '民俗文化', '传统美术', '传统戏曲', '传统医药'];
    const dataValues = [95, 80, 60, 90, 40]; // 用户算法匹配数据
    
    ctx.clearRect(0, 0, width, height); // 清屏重绘

    // 计算顶点的坐标函数
    function getPoint(angle, r) {
        return {
            x: centerX + Math.cos(angle) * r,
            y: centerY + Math.sin(angle) * r
        };
    }

    // 1. 绘制雷达底网 (背景多边形)
    for (let level = 1; level <= 4; level++) {
        const currentRadius = radius * (level / 4);
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i - Math.PI / 2; // 减去 90度，让顶点朝上
            const p = getPoint(angle, currentRadius);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = '#e7e5e4';
        ctx.stroke();
        
        // 填充相间的背景色，增加层次感
        if(level % 2 === 0) {
            ctx.fillStyle = 'rgba(240, 240, 240, 0.5)';
            ctx.fill();
        }
    }

    // 2. 绘制十字交叉线和外围文字标签
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#78716c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        const pEdge = getPoint(angle, radius);
        
        // 画连接中心的射线
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pEdge.x, pEdge.y);
        ctx.strokeStyle = '#e7e5e4';
        ctx.stroke();

        // 画外围文字
        const pLabel = getPoint(angle, radius + 20);
        ctx.fillText(labels[i], pLabel.x, pLabel.y);
    }

    // 3. 绘制核心数据区域 (高亮琥珀色多边形)
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        // 将 100 分制的数据映射到实际渲染半径
        const valRadius = radius * (dataValues[i] / 100);
        const p = getPoint(angle, valRadius);
        
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    
    // 描边与半透明填充
    ctx.strokeStyle = '#d97706'; 
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(217, 119, 6, 0.2)'; 
    ctx.fill();

    // 4. 画数据节点上的小圆点
    for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        const valRadius = radius * (dataValues[i] / 100);
        const p = getPoint(angle, valRadius);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#d97706';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// 页面 DOM 加载完成后立即执行绘制
window.onload = () => {
    drawRadarChart();
};
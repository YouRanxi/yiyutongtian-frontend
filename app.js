// ==========================================
// 创新点一：基于 GNN 逻辑的社交图谱 Canvas 动画渲染
// ==========================================
function initGNNGraph() {
    const canvas = document.getElementById('gnnCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // 模拟 GNN 算法得出的用户节点 (不同颜色代表不同兴趣圈)
    const nodes = [];
    const colors = ['#d97706', '#0ea5e9', '#10b981', '#f43f5e'];
    
    for (let i = 0; i < 30; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.random() * 5 + 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    // 动画循环：绘制连线与移动节点
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // 绘制节点间的社交关联线 (距离越近代表相似度越高)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // GNN 关系阈值
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // 更新与绘制节点
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // 边缘回弹
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            // 添加发光效果
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// 创新点三：动态可交互的数据可视化生成
// ==========================================
function initDataVis() {
    const chartContainer = document.getElementById('barChart');
    if (!chartContainer) return;

    // 模拟后台传来的动态数据
    const data = [
        { label: '手工艺', value: 85, targetWidth: '85%' },
        { label: '戏曲', value: 65, targetWidth: '65%' },
        { label: '民俗', value: 92, targetWidth: '92%' },
        { label: '美术', value: 48, targetWidth: '48%' },
        { label: '医药', value: 35, targetWidth: '35%' }
    ];

    // 利用 DOM 生成原生交互柱状图
    data.forEach(item => {
        const row = document.createElement('div');
        row.className = 'chart-row';
        row.innerHTML = `
            <div class="chart-label">${item.label}</div>
            <div class="chart-bar-container">
                <div class="chart-bar" style="width: 0%;"></div>
            </div>
            <div class="chart-val">${item.value}%</div>
        `;
        chartContainer.appendChild(row);
    });

    // 触发动画，展示数据加载效果
    setTimeout(() => {
        const bars = chartContainer.querySelectorAll('.chart-bar');
        bars.forEach((bar, index) => {
            bar.style.width = data[index].targetWidth;
        });
    }, 500);
}

// ==========================================
// 创新点二：垂直领域的非遗专属 AI 交互逻辑
// ==========================================
let aiOpen = false;

function toggleChat() {
    aiOpen = !aiOpen;
    const body = document.getElementById('aiBody');
    const toggleIcon = document.querySelector('.ai-toggle');
    if (aiOpen) {
        body.classList.add('open');
        toggleIcon.innerText = '▼';
    } else {
        body.classList.remove('open');
        toggleIcon.innerText = '▲';
    }
}

function sendMsg() {
    const input = document.getElementById('aiInput');
    const msgs = document.getElementById('aiMsgs');
    const text = input.value.trim();
    
    if (!text) return;

    // 添加用户消息
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user';
    userDiv.innerText = text;
    msgs.appendChild(userDiv);
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    // 模拟垂直领域大模型思考与回复
    setTimeout(() => {
        const aiDiv = document.createElement('div');
        aiDiv.className = 'msg ai';
        aiDiv.innerText = `根据知识图谱检索：您提到的“${text}”是中国重要的非物质文化遗产。该技艺对工具和火候要求极高，目前主要在江浙一带传承。需要我为您规划一条相关体验路线吗？`;
        msgs.appendChild(aiDiv);
        msgs.scrollTop = msgs.scrollHeight;
    }, 1000); // 模拟 1 秒网络延迟
}

// 绑定回车键发送消息
document.getElementById('aiInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMsg();
});

// ==========================================
// 页面初始化总入口
// ==========================================
window.onload = () => {
    initGNNGraph();
    initDataVis();
};
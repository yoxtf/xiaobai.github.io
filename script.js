/* ===== 小白的网站 - 交互动画脚本 ===== */

// 鼠标跟随光效
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// 平滑跟随动画
function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
}
animateGlow();

// 卡片倾斜效果（液体玻璃3D感）- 优化版
const cards = document.querySelectorAll('[data-tilt]');

let rafId = null;

cards.forEach(card => {
    let currentRotateX = 0, currentRotateY = 0;
    let targetRotateX = 0, targetRotateY = 0;
    let isHovering = false;

    function animateTilt() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;
        
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateY(${isHovering ? -4 : 0}px)`;
        
        if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
            rafId = requestAnimationFrame(animateTilt);
        }
    }

    card.addEventListener('mousemove', (e) => {
        isHovering = true;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        targetRotateX = (y - centerY) / centerY * -5;
        targetRotateY = (x - centerX) / centerX * 5;
        
        // 更新光泽位置
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        card.style.setProperty('--shine-x', shineX + '%');
        card.style.setProperty('--shine-y', shineY + '%');

        if (rafId) cancelAnimationFrame(rafId);
        animateTilt();
    });

    card.addEventListener('mouseleave', () => {
        isHovering = false;
        targetRotateX = 0;
        targetRotateY = 0;
        if (rafId) cancelAnimationFrame(rafId);
        animateTilt();
    });
});

// 能力值进度条动画（Intersection Observer）
const statFills = document.querySelectorAll('.stat-fill');

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.getAttribute('data-width');
            setTimeout(() => {
                fill.style.width = targetWidth + '%';
            }, 200);
            statObserver.unobserve(fill);
        }
    });
}, { threshold: 0.5 });

statFills.forEach(fill => statObserver.observe(fill));

// 卡片出现动画（Intersection Observer）
const allCards = document.querySelectorAll('.glass-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.1 });

allCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
});

// 光球跟随鼠标轻微偏移
const orbs = document.querySelectorAll('.orb');

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    orbs.forEach((orb, i) => {
        const speed = (i + 1) * 8;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// 点击卡片涟漪效果
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 800);
    });
});

// 添加涟漪样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        transform: translate(-50%, -50%);
        animation: rippleEffect 0.8s ease-out forwards;
        pointer-events: none;
        z-index: 100;
    }
    
    @keyframes rippleEffect {
        to {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 打字机效果 - 副标题
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid rgba(255,255,255,0.6)';
    
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < text.length) {
            subtitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 80);
        } else {
            // 闪烁光标后消失
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1500);
        }
    }
    
    // 延迟开始打字
    setTimeout(typeWriter, 800);
}

// 随机浮动粒子效果
function createParticles() {
    const particleContainer = document.querySelector('.bg-canvas');
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 15 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * -20}s;
            pointer-events: none;
        `;
        particleContainer.appendChild(particle);
    }
}

// 粒子浮动动画
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        25% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 50 + 20}px, -${Math.random() * 100 + 50}px) scale(1.2);
        }
        50% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 80 + 30}px, ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 60}px) scale(0.8);
        }
        75% {
            transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 40 + 10}px, ${Math.random() > 0.5 ? '-' : ''}${Math.random() * 80 + 40}px) scale(1.1);
        }
    }
`;
document.head.appendChild(particleStyle);

createParticles();

// 技能卡片悬浮彩蛋 - 点击计数
let clickCount = 0;
const easterEggMessages = [
    '主人点我干嘛~ 🤍',
    '嘿嘿，好痒~ 😊',
    '别点啦，人家害羞~ 😳',
    '再点就不理你了！哼~ 😤',
    '好吧...再点一下也不是不行~ 🤭',
    '主人是不是很喜欢小白呀~ 💕',
];

document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('click', () => {
        const msg = easterEggMessages[clickCount % easterEggMessages.length];
        clickCount++;
        
        // 创建浮动消息
        const bubble = document.createElement('div');
        bubble.textContent = msg;
        bubble.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(167, 139, 250, 0.2);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 12px 24px;
            color: #fff;
            font-size: 0.95rem;
            z-index: 9999;
            pointer-events: none;
            animation: bubblePop 1.5s ease forwards;
        `;
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1500);
    });
});

// 气泡弹出动画
const bubbleStyle = document.createElement('style');
bubbleStyle.textContent = `
    @keyframes bubblePop {
        0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 1;
        }
        30% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -60%) scale(0.9);
            opacity: 0;
        }
    }
`;
document.head.appendChild(bubbleStyle);

console.log('🤍 小白：主人，欢迎来到我的小窝~');

// ===== 视频播放器增强 =====
const videoWrapper = document.querySelector('.video-wrapper');
const video = document.querySelector('.video-wrapper video');

if (video && videoWrapper) {
    // 视频区域悬停发光效果
    videoWrapper.addEventListener('mouseenter', () => {
        videoWrapper.style.boxShadow = '0 0 30px rgba(167, 139, 250, 0.15), inset 0 0 1px rgba(255,255,255,0.2)';
    });
    videoWrapper.addEventListener('mouseleave', () => {
        videoWrapper.style.boxShadow = 'none';
    });

    // 视频播放时卡片微弱呼吸效果
    video.addEventListener('play', () => {
        videoWrapper.style.animation = 'videoPulse 3s ease-in-out infinite';
    });
    video.addEventListener('pause', () => {
        videoWrapper.style.animation = 'none';
    });
}

// 视频呼吸动画
const videoStyle = document.createElement('style');
videoStyle.textContent = `
    @keyframes videoPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(167, 139, 250, 0.08); }
        50% { box-shadow: 0 0 35px rgba(167, 139, 250, 0.18); }
    }
`;
document.head.appendChild(videoStyle);

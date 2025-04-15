/**
 * Stardew Valley 角色动画播放器 - 嵌入式版本
 * 此脚本会自动检测页面上的预设角色元素并显示对应动画
 */
(function() {
    // 预定义所有角色和变体的文件列表
    const STARDEW_FILES = {
        // 角色精灵图文件列表
        characterFiles: [
            'Abigail_Beach.png', 'Abigail_Winter.png', 'Abigail.png',
            'Alex_Beach.png', 'Alex_Winter.png', 'Alex.png',
            'Birdie.png',
            'Caroline_Beach.png', 'Caroline_Winter.png', 'Caroline.png',
            'Clint_Beach.png', 'Clint_Winter.png', 'Clint.png',
            'Demetrius_Winter.png', 'Demetrius.png',
            'Elliott_Beach.png', 'Elliott_Winter.png', 'Elliott.png',
            'Emily_Beach.png', 'Emily_Winter.png', 'Emily.png',
            'Evelyn_Winter.png', 'Evelyn.png',
            'George_Winter.png', 'George.png',
            'Gus_Winter.png', 'Gus.png',
            'Haley_Beach.png', 'Haley_Winter.png', 'Haley.png',
            'Harvey_Beach.png', 'Harvey_Winter.png', 'Harvey.png',
            'Jas_Winter.png', 'Jas.png',
            'Jodi_Beach.png', 'Jodi_Winter.png', 'Jodi.png',
            'Kent_Winter.png', 'Kent.png',
            'Leah_Beach.png', 'Leah_Winter.png', 'Leah.png',
            'Lewis_Beach.png', 'Lewis_Winter.png', 'Lewis.png',
            'Linus_Winter.png', 'Linus.png',
            'Marcello.png',
            'Marnie_Beach.png', 'Marnie_Winter.png', 'Marnie.png',
            'Maru_Beach.png', 'Maru_Hospital.png', 'Maru_Winter.png', 'Maru.png',
            'Morris.png',
            'Pam_Beach.png', 'Pam_Winter.png', 'Pam.png',
            'ParrotBoy_Winter.png', 'ParrotBoy.png',
            'Penny_Beach.png', 'Penny_Winter.png', 'Penny.png',
            'Pierre_Beach.png', 'Pierre_Winter.png', 'Pierre.png',
            'Robin_Beach.png', 'Robin_Winter.png', 'Robin.png',
            'SafariGuy.png',
            'Sam_Beach.png', 'Sam_JojaMart.png', 'Sam_Winter.png', 'Sam.png',
            'Sandy.png',
            'Sebastian_Beach.png', 'Sebastian_Winter.png', 'Sebastian.png',
            'Shane_Beach.png', 'Shane_JojaMart.png', 'Shane_Winter.png', 'Shane.png',
            'Vincent_Winter.png', 'Vincent.png',
            'Willy_Winter.png', 'Willy.png',
            'Wizard.png'
        ],
        
        // 动画配置文件列表
        animationFiles: [
            'Abigail_Beach.json', 'Abigail_Winter.json', 'Abigail.json',
            'Alex_Beach.json', 'Alex_Winter.json', 'Alex.json',
            'Birdie.json',
            'Caroline_Beach.json', 'Caroline_Winter.json', 'Caroline.json',
            'Clint_Beach.json', 'Clint_Winter.json', 'Clint.json',
            'Demetrius_Winter.json', 'Demetrius.json',
            'Elliott_Beach.json', 'Elliott_Winter.json', 'Elliott.json',
            'Emily_Beach.json', 'Emily_Winter.json', 'Emily.json',
            'Evelyn_Winter.json', 'Evelyn.json',
            'George_Winter.json', 'George.json',
            'Gus_Winter.json', 'Gus.json',
            'Haley_Beach.json', 'Haley_Winter.json', 'Haley.json',
            'Harvey_Beach.json', 'Harvey_Winter.json', 'Harvey.json',
            'Jas_Winter.json', 'Jas.json',
            'Jodi_Beach.json', 'Jodi_Winter.json', 'Jodi.json',
            'Kent_Winter.json', 'Kent.json',
            'Leah_Beach.json', 'Leah_Winter.json', 'Leah.json',
            'Lewis_Beach.json', 'Lewis_Winter.json', 'Lewis.json',
            'Linus_Winter.json', 'Linus.json',
            'Marcello.json',
            'Marnie_Beach.json', 'Marnie_Winter.json', 'Marnie.json',
            'Maru_Beach.json', 'Maru_Hospital.json', 'Maru_Winter.json', 'Maru.json',
            'Morris.json',
            'Pam_Beach.json', 'Pam_Winter.json', 'Pam.json',
            'ParrotBoy_Winter.json', 'ParrotBoy.json',
            'Penny_Beach.json', 'Penny_Winter.json', 'Penny.json',
            'Pierre_Beach.json', 'Pierre_Winter.json', 'Pierre.json',
            'Robin_Beach.json', 'Robin_Winter.json', 'Robin.json',
            'SafariGuy.json',
            'Sam_Beach.json', 'Sam_JojaMart.json', 'Sam_Winter.json', 'Sam.json',
            'Sandy.json',
            'Sebastian_Beach.json', 'Sebastian_Winter.json', 'Sebastian.json',
            'Shane_Beach.json', 'Shane_JojaMart.json', 'Shane_Winter.json', 'Shane.json',
            'Vincent_Winter.json', 'Vincent.json',
            'Willy_Winter.json', 'Willy.json',
            'Wizard.json'
        ],
        
        // 所有可用的变体类型
        variantTypes: [
            { value: 'Beach', label: '海滩' },
            { value: 'Winter', label: '冬季' },
            { value: 'JojaMart', label: 'Joja超市' },
            { value: 'Hospital', label: '医院' }
        ]
    };
    
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
        // 查找所有带有角色播放器标识的容器
        const playerContainers = document.querySelectorAll('#stardew-character-player, [data-stardew-character]');
        
        if (playerContainers.length === 0) {
            console.warn('未找到Stardew Valley角色播放器容器');
            return;
        }
        
        // 为每个容器初始化播放器
        playerContainers.forEach(container => {
            initCharacterPlayer(container);
        });
    });
    
    /**
     * 初始化角色播放器
     * @param {HTMLElement} container - 角色播放器容器元素
     */
    function initCharacterPlayer(container) {
        // 从容器的data属性获取角色名称
        const characterName = container.dataset.character || container.dataset.stardewCharacter;
        
        if (!characterName) {
            container.innerHTML = '<div class="stardew-embed-error">未指定角色名称</div>';
            return;
        }
        
        console.log(`初始化角色播放器: ${characterName}`);
        
        // 创建播放器DOM结构
        createPlayerStructure(container, characterName);
        
        // 加载角色数据
        loadCharacterData(characterName, container);
    }
    
    /**
     * 创建播放器DOM结构
     * @param {HTMLElement} container - 容器元素
     * @param {string} characterName - 角色名称
     */
    function createPlayerStructure(container, characterName) {
        // 设置容器类
        container.classList.add('stardew-embed');
        
        // 创建基本结构
        container.innerHTML = `
            <div class="stardew-embed-container">
                <div class="stardew-embed-sidebar">
                    <h3 class="stardew-embed-title">${characterName}</h3>
                    <ul class="stardew-embed-variants">
                        <li class="stardew-embed-variant-item active" data-variant="">默认</li>
                        <!-- 变体选项将由JS动态添加 -->
                    </ul>
                </div>
                <div class="stardew-embed-content">
                    <div class="stardew-embed-loading">加载中...</div>
                    <div class="stardew-embed-animations">
                        <!-- 动画将由JS动态添加 -->
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * 加载角色数据
     * @param {string} characterName - 角色名称
     * @param {HTMLElement} container - 容器元素
     */
    async function loadCharacterData(characterName, container) {
        // 在容器内找到相关元素
        const sidebar = container.querySelector('.stardew-embed-sidebar');
        const variantsList = container.querySelector('.stardew-embed-variants');
        const contentArea = container.querySelector('.stardew-embed-content');
        const loadingIndicator = container.querySelector('.stardew-embed-loading');
        const animationsContainer = container.querySelector('.stardew-embed-animations');
        
        // 存储角色数据
        const characterData = {};
        
        // 显示加载指示器
        loadingIndicator.style.display = 'block';
        animationsContainer.style.display = 'none';
        
        try {
            // 1. 获取可用的变体列表
            const variants = await getCharacterVariants(characterName);
            
            // 2. 添加变体选项
            if (variants.length > 0) {
                // 清除默认变体项之后的所有项
                while (variantsList.children.length > 1) {
                    variantsList.removeChild(variantsList.lastChild);
                }
                
                // 添加找到的变体
                variants.forEach(variant => {
                    const variantElement = document.createElement('li');
                    variantElement.className = 'stardew-embed-variant-item';
                    variantElement.dataset.variant = variant.value;
                    variantElement.textContent = variant.label;
                    variantsList.appendChild(variantElement);
                    
                    // 添加点击事件处理
                    variantElement.addEventListener('click', async () => {
                        // 更新活动状态
                        variantsList.querySelectorAll('.stardew-embed-variant-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        variantElement.classList.add('active');
                        
                        // 显示加载指示器
                        loadingIndicator.style.display = 'block';
                        animationsContainer.style.display = 'none';
                        
                        // 加载变体动画
                        const variantFullName = variant.value ? `${characterName}_${variant.value}` : characterName;
                        await loadAndDisplayAnimations(variantFullName, animationsContainer);
                        
                        // 隐藏加载指示器
                        loadingIndicator.style.display = 'none';
                        animationsContainer.style.display = 'flex';
                    });
                });
            }
            
            // 3. 为默认变体添加点击事件
            const defaultVariantElement = variantsList.querySelector('.stardew-embed-variant-item[data-variant=""]');
            if (defaultVariantElement) {
                defaultVariantElement.addEventListener('click', async () => {
                    // 更新活动状态
                    variantsList.querySelectorAll('.stardew-embed-variant-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    defaultVariantElement.classList.add('active');
                    
                    // 显示加载指示器
                    loadingIndicator.style.display = 'block';
                    animationsContainer.style.display = 'none';
                    
                    // 加载默认动画
                    await loadAndDisplayAnimations(characterName, animationsContainer);
                    
                    // 隐藏加载指示器
                    loadingIndicator.style.display = 'none';
                    animationsContainer.style.display = 'flex';
                });
            }
            
            // 4. 默认加载基本版本的动画
            await loadAndDisplayAnimations(characterName, animationsContainer);
            
        } catch (error) {
            console.error(`加载角色数据失败: ${error.message}`);
            animationsContainer.innerHTML = `<div class="stardew-embed-error">加载角色 ${characterName} 失败: ${error.message}</div>`;
        } finally {
            // 隐藏加载指示器
            loadingIndicator.style.display = 'none';
            animationsContainer.style.display = 'flex';
        }
    }
      /**
     * 获取角色可用变体
     * @param {string} characterName - 角色名称
     * @returns {Promise<Array>} - 变体数组
     */
    async function getCharacterVariants(characterName) {
        const availableVariants = [];
        
        // 从预定义的文件列表中检查该角色的可用变体
        for (const variant of STARDEW_FILES.variantTypes) {
            // 检查是否存在对应的变体文件名
            const variantFileName = `${characterName}_${variant.value}.json`;
            if (STARDEW_FILES.animationFiles.includes(variantFileName)) {
                availableVariants.push(variant);
            }
        }
        
        return availableVariants;
    }
    
    /**
     * 加载并显示动画
     * @param {string} characterName - 角色名称
     * @param {HTMLElement} container - 动画容器
     */
    async function loadAndDisplayAnimations(characterName, container) {
        try {
            // 清空之前的动画
            container.innerHTML = '';
            
            // 加载动画配置
            const animationConfig = await loadAnimationConfig(characterName);
            
            // 加载精灵图片
            const spriteImage = await loadSpriteImage(characterName);
            
            // 显示动画
            displayAnimations(characterName, animationConfig, spriteImage, container);
            
        } catch (error) {
            console.error(`加载动画失败: ${error.message}`);
            container.innerHTML = `<div class="stardew-embed-error">加载动画失败: ${error.message}</div>`;
        }
    }
    
    /**
     * 加载动画配置
     * @param {string} characterName - 角色名称
     * @returns {Promise<Array>} - 动画配置数组
     */
    async function loadAnimationConfig(characterName) {
        try {
            // 从Animations目录加载对应的JSON文件
            const response = await fetch(`https://wiki.biligame.com/stardewvalley/%E6%95%B0%E6%8D%AE:Animation/${characterName}.json?action=raw&ctype=application/json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // 获取原始JSON文本
            const jsonText = await response.text();
            
            // 使用自定义函数解析JSON，处理尾部逗号的问题
            return parseJsonWithTrailingCommas(jsonText);
        } catch (error) {
            console.error(`加载 ${characterName} 的动画配置失败:`, error);
            throw error;
        }
    }
    
    /**
     * 处理JSON尾部逗号的自定义解析函数
     * @param {string} jsonString - 含有可能的尾部逗号的JSON字符串
     * @returns {Object} - 解析后的对象
     */
    function parseJsonWithTrailingCommas(jsonString) {
        // 移除对象内属性后的尾部逗号
        // 正则表达式匹配: 逗号后跟任意空白字符，然后是 } 或 ]
        const fixedJsonString = jsonString.replace(/,(\s*[\}\]])/g, '$1');
        
        // 使用标准JSON解析器解析修正后的字符串
        return JSON.parse(fixedJsonString);
    }
    
    /**
     * 加载精灵图片
     * @param {string} characterName - 角色名称
     * @returns {Promise<HTMLImageElement>} - 加载的图片元素
     */
    async function loadSpriteImage(characterName) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `Characters/${characterName}.png`;
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`加载精灵图 ${characterName}.png 失败`));
        });
    }
    
    /**
     * 显示动画
     * @param {string} characterName - 角色名称
     * @param {Array} animations - 动画配置数组
     * @param {HTMLImageElement} spriteImage - 角色精灵图
     * @param {HTMLElement} container - 动画容器
     */
    function displayAnimations(characterName, animations, spriteImage, container) {
        if (!animations || animations.length === 0) {
            container.innerHTML = `<div class="stardew-embed-error">没有找到 ${characterName} 的动画。</div>`;
            return;
        }
        
        // 精灵尺寸信息
        const frameWidth = 16;   // 精灵宽度为16px
        const frameHeight = 32;  // 精灵高度为32px
        const framesPerRow = 4;  // 每行4个精灵
        
        // 为每个动画创建元素
        animations.forEach(animation => {
            const animationBox = document.createElement('div');
            animationBox.className = 'stardew-embed-animation';
            
            // 创建但隐藏动画标题
            const animationTitle = document.createElement('div');
            animationTitle.className = 'stardew-embed-animation-title';
            animationTitle.textContent = animation.animation;
            
            // 创建精灵容器
            const spriteContainer = document.createElement('div');
            spriteContainer.className = 'stardew-embed-sprite-container';
            
            // 创建精灵元素
            const spriteElement = document.createElement('div');
            spriteElement.className = 'stardew-embed-sprite';
            spriteElement.style.width = `${spriteImage.width}px`;
            spriteElement.style.height = `${spriteImage.height}px`;
            spriteElement.style.backgroundImage = `url(https://wiki.biligame.com/stardewvalley/Special:Redirect/file/Animation_${characterName}.png)`;
            
            // 组装DOM结构
            spriteContainer.appendChild(spriteElement);
            animationBox.appendChild(animationTitle);
            animationBox.appendChild(spriteContainer);
            container.appendChild(animationBox);
            
            // 添加提示显示动画名称
            animationBox.title = animation.animation;
            
            // 开始动画
            startAnimation(spriteElement, animation.frames, frameWidth, frameHeight, framesPerRow);
        });
    }
    
    /**
     * 开始动画
     * @param {HTMLElement} spriteElement - 精灵元素
     * @param {Array<number>} frames - 帧序列
     * @param {number} frameWidth - 帧宽度
     * @param {number} frameHeight - 帧高度
     * @param {number} framesPerRow - 每行帧数
     */
    function startAnimation(spriteElement, frames, frameWidth, frameHeight, framesPerRow) {
        let frameIndex = 0;
        let animationInterval;
        
        // 清除可能存在的旧定时器
        if (spriteElement.dataset.intervalId) {
            clearInterval(parseInt(spriteElement.dataset.intervalId));
        }
        
        // 定时器用于循环播放动画
        animationInterval = setInterval(() => {
            const currentFrame = frames[frameIndex];
            const row = Math.floor(currentFrame / framesPerRow);
            const col = currentFrame % framesPerRow;
            
            // 设置背景位置以显示正确的帧
            spriteElement.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;
            
            // 更新帧索引
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200); // 每200毫秒切换一帧
        
        // 保存定时器ID，以便后续清除
        spriteElement.dataset.intervalId = animationInterval;
    }
})();

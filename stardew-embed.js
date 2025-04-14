/**
 * Stardew Valley 角色动画播放器 - 嵌入式版本
 * 此脚本会自动检测页面上的预设角色元素并显示对应动画
 */
(function() {
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
        // 注意：在实际环境中，这个函数可以从服务器获取变体列表
        // 这里我们使用一个预设的列表来模拟常见的变体
        
        const commonVariants = [
            { value: 'Beach', label: '海滩' },
            { value: 'Winter', label: '冬季' },
            { value: 'JojaMart', label: 'Joja超市' },
            { value: 'Hospital', label: '医院' }
        ];
        
        const availableVariants = [];
        
        // 检查每个变体是否存在
        for (const variant of commonVariants) {
            try {
                // 尝试加载变体的动画配置文件，判断是否存在该变体
                const response = await fetch(`Animations/${characterName}_${variant.value}.json`);
                if (response.ok) {
                    availableVariants.push(variant);
                }
            } catch (error) {
                // 忽略错误，表示变体不存在
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
            const response = await fetch(`Animations/${characterName}.json`);
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
            spriteElement.style.backgroundImage = `url(Characters/${characterName}.png)`;
            
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

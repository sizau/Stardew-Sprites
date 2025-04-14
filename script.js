document.addEventListener('DOMContentLoaded', () => {
    const characterSelect = document.getElementById('character-select');
    const animationsContainer = document.getElementById('animations-container');
    const loadingIndicator = document.getElementById('loading');
    
    // 存储已加载的角色数据
    const characterData = {};
    
    // 初始化角色选择下拉菜单
    initCharacterSelect();
    
    // 监听角色选择变化
    characterSelect.addEventListener('change', async () => {
        const selectedCharacter = characterSelect.value;
        if (!selectedCharacter) {
            animationsContainer.innerHTML = '';
            return;
        }
        
        showLoading(true);
        await loadAndDisplayCharacterAnimations(selectedCharacter);
        showLoading(false);
    });
    
    // 初始化角色选择下拉菜单
    async function initCharacterSelect() {
        try {
            // 获取所有字符文件列表
            const characterFiles = await fetchCharactersList();
            
            // 提取不带扩展名的角色名称并去重
            const uniqueCharacters = new Set();
            characterFiles.forEach(file => {
                const baseName = file.replace('.png', '');
                uniqueCharacters.add(baseName);
            });
            
            // 按字母顺序排序角色名称
            const sortedCharacters = Array.from(uniqueCharacters).sort();
            
            // 添加到下拉菜单
            sortedCharacters.forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.textContent = character;
                characterSelect.appendChild(option);
            });
        } catch (error) {
            console.error('获取角色列表失败:', error);
        }
    }
    
    // 获取角色列表
    async function fetchCharactersList() {
        try {
            const response = await fetch('characters-list.php');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('获取角色列表失败:', error);
            // 返回一些默认角色以便于测试
            return ['Abigail.png', 'Alex.png', 'Haley.png', 'Sebastian.png'];
        }
    }
    
    // 加载和显示角色动画
    async function loadAndDisplayCharacterAnimations(characterName) {
        try {
            animationsContainer.innerHTML = '';
            
            // 如果角色数据已缓存，直接使用
            if (characterData[characterName]) {
                displayAnimations(characterName, characterData[characterName].animations, characterData[characterName].spriteImage);
                return;
            }
            
            // 加载角色动画配置
            const animationConfig = await loadAnimationConfig(characterName);
            
            // 加载角色精灵图
            const spriteImage = await loadSpriteImage(characterName);
            
            // 缓存角色数据
            characterData[characterName] = {
                animations: animationConfig,
                spriteImage
            };
            
            // 显示动画
            displayAnimations(characterName, animationConfig, spriteImage);
        } catch (error) {
            console.error(`加载角色 ${characterName} 的动画失败:`, error);
            animationsContainer.innerHTML = `<div class="error">加载角色 ${characterName} 的动画失败。</div>`;
        }
    }
    
    // 加载动画配置
    async function loadAnimationConfig(characterName) {
        try {
            const response = await fetch(`load-animation.php?character=${encodeURIComponent(characterName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`加载 ${characterName} 的动画配置失败:`, error);
            
            // 为测试目的，返回一些默认动画配置
            if (characterName === "Abigail") {
                return [
                    {
                        "animation": "AnimateDown",
                        "frames": [0, 1, 2, 3],
                        "eventId": ""
                    },
                    {
                        "animation": "AnimateRight",
                        "frames": [4, 5, 6, 7],
                        "eventId": ""
                    },
                    {
                        "animation": "AnimateUp",
                        "frames": [8, 9, 10, 11],
                        "eventId": ""
                    },
                    {
                        "animation": "AnimateLeft",
                        "frames": [12, 13, 14, 15],
                        "eventId": ""
                    }
                ];
            }
            return [];
        }
    }
    
    // 加载精灵图
    async function loadSpriteImage(characterName) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `Characters/${characterName}.png`;
            
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`加载精灵图 ${characterName}.png 失败`);
                reject(new Error(`加载精灵图 ${characterName}.png 失败`));
            };
        });
    }
    
    // 显示动画
    function displayAnimations(characterName, animations, spriteImage) {
        if (!animations || animations.length === 0) {
            animationsContainer.innerHTML = `<div class="error">没有找到 ${characterName} 的动画。</div>`;
            return;
        }
        
        // 计算精灵图的尺寸信息
        const frameWidth = spriteImage.width / 4; // 每行4帧
        const frameHeight = spriteImage.height / 4; // 每列4帧
        
        // 为每个动画创建一个盒子
        animations.forEach(animation => {
            const animationBox = document.createElement('div');
            animationBox.className = 'animation-box';
            
            const animationTitle = document.createElement('div');
            animationTitle.className = 'animation-title';
            animationTitle.textContent = animation.animation;
            
            const spriteContainer = document.createElement('div');
            spriteContainer.className = 'sprite-container';
            
            const spriteElement = document.createElement('div');
            spriteElement.className = 'sprite';
            spriteElement.style.width = `${spriteImage.width}px`;
            spriteElement.style.height = `${spriteImage.height}px`;
            spriteElement.style.backgroundImage = `url(Characters/${characterName}.png)`;
            
            spriteContainer.appendChild(spriteElement);
            animationBox.appendChild(animationTitle);
            animationBox.appendChild(spriteContainer);
            animationsContainer.appendChild(animationBox);
            
            // 开始动画
            startAnimation(spriteElement, animation.frames, frameWidth, frameHeight);
        });
    }
    
    // 开始动画
    function startAnimation(spriteElement, frames, frameWidth, frameHeight) {
        let frameIndex = 0;
        
        // 定时器用于循环播放动画
        setInterval(() => {
            const currentFrame = frames[frameIndex];
            const row = Math.floor(currentFrame / 4);
            const col = currentFrame % 4;
            
            // 设置背景位置以显示正确的帧
            spriteElement.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;
            
            // 更新帧索引
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200); // 每200毫秒切换一帧
    }
    
    // 显示/隐藏加载指示器
    function showLoading(isLoading) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
});

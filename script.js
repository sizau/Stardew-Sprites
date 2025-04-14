document.addEventListener('DOMContentLoaded', () => {
    const characterSelect = document.getElementById('character-select');
    const variantSelect = document.getElementById('variant-select');
    const variantContainer = document.getElementById('variant-container');
    const animationsContainer = document.getElementById('animations-container');
    const loadingIndicator = document.getElementById('loading');
    
    // 存储已加载的角色数据
    const characterData = {};
    
    // 用于存储角色列表
    let characterList = [];
    
    // 初始化角色选择下拉菜单
    initCharacterSelect();
    
    // 监听角色选择变化
    characterSelect.addEventListener('change', async () => {
        const selectedCharacter = characterSelect.value;
        if (!selectedCharacter) {
            animationsContainer.innerHTML = '';
            variantContainer.style.display = 'none';
            return;
        }
        
        // 检查是否存在变体版本
        checkCharacterVariants(selectedCharacter);
        
        // 加载默认版本的角色
        showLoading(true);
        await loadAndDisplayCharacterAnimations(selectedCharacter);
        showLoading(false);
    });
    
    // 监听变体选择变化
    variantSelect.addEventListener('change', async () => {
        const selectedCharacter = characterSelect.value;
        const selectedVariant = variantSelect.value;
        
        if (!selectedCharacter) return;
        
        showLoading(true);
        
        // 如果选择了变体，加载变体版本
        if (selectedVariant) {
            await loadAndDisplayCharacterAnimations(`${selectedCharacter}_${selectedVariant}`);
        } else {
            // 否则加载默认版本
            await loadAndDisplayCharacterAnimations(selectedCharacter);
        }
        
        showLoading(false);
    });
    
    // 初始化角色选择下拉菜单
    async function initCharacterSelect() {
        try {
            // 直接列出Characters目录下的所有PNG文件
            characterList = await fetchCharactersList();
            
            // 提取基本角色名称（不包括变体）
            const baseCharacters = new Set();
            characterList.forEach(filename => {
                // 去除文件扩展名并检查是否为基本角色（没有下划线）
                const nameParts = filename.replace('.png', '').split('_');
                if (nameParts.length === 1) {
                    baseCharacters.add(nameParts[0]);
                }
            });
            
            // 按字母顺序排序角色名称
            const sortedCharacters = Array.from(baseCharacters).sort();
            
            // 添加到下拉菜单
            sortedCharacters.forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.textContent = character;
                characterSelect.appendChild(option);
            });
        } catch (error) {
            console.error('获取角色列表失败:', error);
            
            // 添加一些默认角色以便于测试
            ['Abigail', 'Alex', 'Emily', 'Sebastian'].forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.textContent = character;
                characterSelect.appendChild(option);
            });
        }
    }
      // 检查角色是否有变体版本
    function checkCharacterVariants(characterName) {
        // 先重置变体选择器
        variantSelect.value = '';
        variantContainer.style.display = 'none';
        
        // 检查是否存在变体版本
        const hasBeach = characterList.includes(`${characterName}_Beach.png`);
        const hasWinter = characterList.includes(`${characterName}_Winter.png`);
        const hasJojaMart = characterList.includes(`${characterName}_JojaMart.png`);
        const hasHospital = characterList.includes(`${characterName}_Hospital.png`);
        
        // 如果存在变体版本，显示变体选择器
        if (hasBeach || hasWinter || hasJojaMart || hasHospital) {
            variantContainer.style.display = 'inline-block';
            
            // 清空现有的变体选项（保留默认选项）
            while (variantSelect.options.length > 1) {
                variantSelect.remove(1);
            }
            
            // 添加存在的变体选项
            if (hasBeach) {
                const option = document.createElement('option');
                option.value = 'Beach';
                option.textContent = '海滩';
                variantSelect.appendChild(option);
            }
            
            if (hasWinter) {
                const option = document.createElement('option');
                option.value = 'Winter';
                option.textContent = '冬季';
                variantSelect.appendChild(option);
            }
            
            if (hasJojaMart) {
                const option = document.createElement('option');
                option.value = 'JojaMart';
                option.textContent = 'Joja超市';
                variantSelect.appendChild(option);
            }
            
            if (hasHospital) {
                const option = document.createElement('option');
                option.value = 'Hospital';
                option.textContent = '医院';
                variantSelect.appendChild(option);
            }
        }
    }
    
    // 获取角色列表（纯前端实现）
    async function fetchCharactersList() {
        try {
            // 根据工作区结构中看到的文件列表来构建角色列表
            const characterFiles = [
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
            ];
            
            return characterFiles;
        } catch (error) {
            console.error('获取角色列表失败:', error);
            return [];
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
      // 加载动画配置（纯前端实现）
    async function loadAnimationConfig(characterName) {
        try {
            // 直接从Animations目录加载对应的JSON文件
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
    
    // 处理JSON尾部逗号的自定义解析函数
    function parseJsonWithTrailingCommas(jsonString) {
        // 移除对象内属性后的尾部逗号
        // 正则表达式匹配: 逗号后跟任意空白字符，然后是 } 或 ]
        const fixedJsonString = jsonString.replace(/,(\s*[\}\]])/g, '$1');
        
        // 使用标准JSON解析器解析修正后的字符串
        return JSON.parse(fixedJsonString);
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
        
        // 根据您的说明调整精灵图的尺寸信息
        // 每个精灵是16px x 32px，每行4个
        const frameWidth = 16; // 精灵宽度为16px
        const frameHeight = 32; // 精灵高度为32px
        const framesPerRow = 4; // 每行4个精灵
        
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
            startAnimation(spriteElement, animation.frames, frameWidth, frameHeight, framesPerRow);
        });
    }
    
    // 开始动画
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
    
    // 显示/隐藏加载指示器
    function showLoading(isLoading) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
});

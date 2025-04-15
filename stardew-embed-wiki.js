(function () {
    const STARDEW_FILES = {
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
        variantTypes: [
            { value: 'Beach', label: '海滩' },
            { value: 'Winter', label: '冬季' },
            { value: 'JojaMart', label: 'Joja超市' },
            { value: 'Hospital', label: '医院' }
        ]
    };
    (() => {
        const playerContainers = document.querySelectorAll('#stardew-character-player, [data-stardew-character]');
        if (playerContainers.length === 0) {
            console.warn('未找到Stardew Valley角色播放器容器');
            return;
        }
        playerContainers.forEach(container => {
            initCharacterPlayer(container);
        });
    })();
    function initCharacterPlayer(container) {
        const characterName = container.dataset.character || container.dataset.stardewCharacter;
        if (!characterName) {
            container.innerHTML = '<div class="stardew-embed-error">未指定角色名称</div>';
            return;
        }
        console.log(`初始化角色播放器: ${characterName}`);
        createPlayerStructure(container, characterName);
        loadCharacterData(characterName, container);
    }
    function createPlayerStructure(container, characterName) {
        container.classList.add('stardew-embed');
        container.innerHTML = `
            <div class="stardew-embed-container">
                <div class="stardew-embed-tabs">
                    <div class="stardew-embed-variants">
                        <div class="stardew-embed-variant-item active" data-variant="">默认</div>
                    </div>
                </div>
                <div class="stardew-embed-content">
                    <div class="stardew-embed-loading">加载中...</div>
                    <div class="stardew-embed-animations">
                    </div>
                </div>
            </div>
        `;
    }
    async function loadCharacterData(characterName, container) {
        const sidebar = container.querySelector('.stardew-embed-sidebar');
        const variantsList = container.querySelector('.stardew-embed-variants');
        const contentArea = container.querySelector('.stardew-embed-content');
        const loadingIndicator = container.querySelector('.stardew-embed-loading');
        const animationsContainer = container.querySelector('.stardew-embed-animations');
        const characterData = {};
        loadingIndicator.style.display = 'block';
        animationsContainer.style.display = 'none';
        try {
            const variants = await getCharacterVariants(characterName);
            if (variants.length > 0) {
                while (variantsList.children.length > 1) {
                    variantsList.removeChild(variantsList.lastChild);
                }
                variants.forEach(variant => {
                    const variantElement = document.createElement('div');
                    variantElement.className = 'stardew-embed-variant-item';
                    variantElement.dataset.variant = variant.value;
                    variantElement.textContent = variant.label;
                    variantsList.appendChild(variantElement);
                    variantElement.addEventListener('click', async () => {
                        variantsList.querySelectorAll('.stardew-embed-variant-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        variantElement.classList.add('active');
                        loadingIndicator.style.display = 'block';
                        animationsContainer.style.display = 'none';
                        const variantFullName = variant.value ? `${characterName}_${variant.value}` : `${characterName}`;
                        await loadAndDisplayAnimations(variantFullName, animationsContainer);
                        loadingIndicator.style.display = 'none';
                        animationsContainer.style.display = 'flex';
                    });
                });
            }
            const defaultVariantElement = variantsList.querySelector('.stardew-embed-variant-item[data-variant=""]');
            if (defaultVariantElement) {
                defaultVariantElement.addEventListener('click', async () => {
                    variantsList.querySelectorAll('.stardew-embed-variant-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    defaultVariantElement.classList.add('active');
                    loadingIndicator.style.display = 'block';
                    animationsContainer.style.display = 'none';
                    await loadAndDisplayAnimations(characterName, animationsContainer);
                    loadingIndicator.style.display = 'none';
                    animationsContainer.style.display = 'flex';
                });
            }
            await loadAndDisplayAnimations(characterName, animationsContainer);
        } catch (error) {
            console.error(`加载角色数据失败: ${error.message}`);
            animationsContainer.innerHTML = `<div class="stardew-embed-error">加载角色 ${characterName} 失败: ${error.message}</div>`;
        } finally {
            loadingIndicator.style.display = 'none';
            animationsContainer.style.display = 'flex';
        }
    }
    async function getCharacterVariants(characterName) {
        const availableVariants = [];
        for (const variant of STARDEW_FILES.variantTypes) {
            const variantFileName = `${characterName}_${variant.value}.json`;
            if (STARDEW_FILES.animationFiles.includes(variantFileName)) {
                availableVariants.push(variant);
            }
        }
        return availableVariants;
    }
    async function loadAndDisplayAnimations(characterName, container) {
        try {
            container.innerHTML = '';
            const animationConfig = await loadAnimationConfig(characterName);
            const spriteImage = await loadSpriteImage(characterName);
            displayAnimations(characterName, animationConfig, spriteImage, container);
        } catch (error) {
            console.error(`加载动画失败: ${error.message}`);
            container.innerHTML = `<div class="stardew-embed-error">加载动画失败: ${error.message}</div>`;
        }
    }
    async function loadAnimationConfig(characterName) {
        try {
            const response = await fetch(`https://wiki.biligame.com/stardewvalley/%E6%95%B0%E6%8D%AE:Animation/${characterName}.json?action=raw&ctype=application/json`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const jsonText = await response.text();
            return parseJsonWithTrailingCommas(jsonText);
        } catch (error) {
            console.error(`加载 ${characterName} 的动画配置失败:`, error);
            throw error;
        }
    }
    function parseJsonWithTrailingCommas(jsonString) {
        const fixedJsonString = jsonString.replace(/,(\s*[\}\]])/g, '$1');
        return JSON.parse(fixedJsonString);
    }
    async function loadSpriteImage(characterName) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = `https://wiki.biligame.com/stardewvalley/Special:Redirect/file/Animation_${characterName}.png`;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`加载精灵图 ${characterName}.png 失败`));
        });
    }
    function displayAnimations(characterName, animations, spriteImage, container) {
        if (!animations || animations.length === 0) {
            container.innerHTML = `<div class="stardew-embed-error">没有找到 ${characterName} 的动画。</div>`;
            return;
        }
        const frameWidth = 16;
        const frameHeight = 32;
        const framesPerRow = 4;
        animations.forEach(animation => {
            const animationBox = document.createElement('div');
            animationBox.className = 'stardew-embed-animation';
            const animationTitle = document.createElement('div');
            animationTitle.className = 'stardew-embed-animation-title';
            animationTitle.textContent = animation.animation.replace('lauphing', 'laughing');;
            const spriteContainer = document.createElement('div');
            spriteContainer.className = 'stardew-embed-sprite-container';
            const spriteElement = document.createElement('div');
            spriteElement.className = 'stardew-embed-sprite';
            spriteElement.style.width = `${spriteImage.width}px`;
            spriteElement.style.height = `${spriteImage.height}px`;
            spriteElement.style.backgroundImage = `url(https://wiki.biligame.com/stardewvalley/Special:Redirect/file/Animation_${characterName}.png)`;
            spriteContainer.appendChild(spriteElement);
            animationBox.appendChild(animationTitle);
            animationBox.appendChild(spriteContainer);
            container.appendChild(animationBox);
            animationBox.title = animation.animation.replace('lauphing', 'laughing');;
            startAnimation(spriteElement, animation.frames, frameWidth, frameHeight, framesPerRow);
        });
    }
    function startAnimation(spriteElement, frames, frameWidth, frameHeight, framesPerRow) {
        let frameIndex = 0;
        let animationInterval;
        if (spriteElement.dataset.intervalId) {
            clearInterval(parseInt(spriteElement.dataset.intervalId));
        }
        animationInterval = setInterval(() => {
            const currentFrame = frames[frameIndex];
            const row = Math.floor(currentFrame / framesPerRow);
            const col = currentFrame % framesPerRow;
            spriteElement.style.backgroundPosition = `-${col * frameWidth}px -${row * frameHeight}px`;
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200);
        spriteElement.dataset.intervalId = animationInterval;
    }
})();

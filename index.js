function shuffle(array) {
    let shuffled = array.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}
function formatNumber(num) {
    return num >= 1000 ? num.toExponential() : num;
}

const renderChest  = (reward) => `
    <div class="chest-container" data-reward="${reward}">
        <div class="chest">
            <div class="lid"></div>
            <div class="left-corner"></div>
            <div class="right-corner"></div>
            <div class="left-box"></div>
            <div class="right-box"></div>
            <div class="top-box"></div>
            <div class="bottom-box"></div>
            <div class="lock"></div>
        </div>
        ${
            reward > 0 ? `
                <div class="reward">
                    💰
                    <br />
                    ${formatNumber(reward)}
                </div>
            ` : `
                <div class="reward lose">
                    Lose
                </div>
            `
        }
    </div>
`;
const renderResult = (level, total) => `
    Reached level <span class="number">${level}⬆️</span>;
    Reward: <span class="number">${total}💰</span>
`;
const rewards = [-1, 10, 20, 30];
const gameScreen = document.querySelector('#gameScreen');
const initialScreen = document.querySelector('#initialScreen');
let bestRecord = Number(localStorage.getItem('bestRecord'));
let bestLevel = Number(localStorage.getItem('bestLevel'));

function toggleBlocked() {
    gameScreen.classList.toggle('blocked');
}
function toggleScreen() {
    gameScreen.classList.toggle('hidden');
    initialScreen.classList.toggle('hidden');
}
function setValue(name, value) {
    document.querySelector(`#${name}`).innerHTML = String(value);
}
function renderStatistic(level) {
    setValue('level', level);
    setValue('minReward', rewards[1] * level);
    setValue('maxReward', rewards[3] * level);
    setValue('bestRecord', bestRecord);
    setValue('bestLevel', bestLevel);
}
function generateLevel(level, total) {
    renderStatistic(level);
    gameScreen.innerHTML = '';
    shuffle(rewards).forEach((reward) => {
        gameScreen.insertAdjacentHTML('afterbegin', renderChest(reward * level));
    });
    document
        .querySelectorAll('.chest-container')
        .forEach((element) => {
            element.addEventListener('click', (event) => {
                event.currentTarget.querySelector('.chest').classList.add('hidden');
                setTimeout(() => {
                    document.querySelectorAll('.chest:not(.hidden)').forEach((element) => {
                        element.classList.add('hidden');
                    });
                }, 300);

                const reward = Number(event.currentTarget.dataset.reward);
                let nextLevel = level + 1;

                if (reward < 0) {
                    if (total > bestRecord) {
                        bestRecord = total;
                        bestLevel = level;
                        localStorage.setItem('bestRecord', bestRecord);
                        localStorage.setItem('bestLevel', bestLevel);
                    }

                    toggleBlocked();
                    setTimeout(() => {
                        document.querySelector('#runResult').innerHTML = renderResult(level, total);
                        toggleScreen();
                        toggleBlocked();
                    }, 2000);

                    return;
                }

                total += reward;
                setValue('total', formatNumber(total));

                toggleBlocked();
                setTimeout(() => {
                    generateLevel(nextLevel, total);
                    toggleBlocked();
                }, 2000);
            });
        });
}

renderStatistic(1);
document.querySelector('#start').addEventListener('click', () => {
    generateLevel(1, 0);
    toggleScreen();
});

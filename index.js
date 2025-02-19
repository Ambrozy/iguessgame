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
        <div class="reward">
            💰
            <br />
            ${reward > 0 ? formatNumber(reward) : 'Lose'}
        </div>
    </div>
`;
const rewards = [-1, 10, 20, 30];
let total = 0;
const container = document.querySelector('.container');
let bestRecord = Number(localStorage.getItem('bestRecord'));

function toggleBlocked() {
    document
        .querySelector('.container')
        .classList
        .toggle('blocked');
}
function setValue(name, value) {
    document.querySelector(`#${name}`).innerHTML = String(value);
}
function generateLevel(level) {
    container.innerHTML = '';
    shuffle(rewards).forEach((reward) => {
        container.insertAdjacentHTML('afterbegin', renderChest(reward * level));
    });
    setValue('level', level);
    setValue('minReward', rewards[1] * level);
    setValue('maxReward', rewards[3] * level);
    setValue('bestRecord', bestRecord);
    document
        .querySelectorAll('.chest-container')
        .forEach((element) => {
            element.addEventListener('click', (event) => {
                event.currentTarget.querySelector('.chest').classList.add('hidden');

                const reward = Number(event.currentTarget.dataset.reward);
                let nextLevel = level + 1;

                if (reward < 0) {
                    if (total > bestRecord) {
                        bestRecord = total;
                        localStorage.setItem('bestRecord', bestRecord);
                    }
                    total = 0;
                    nextLevel = 1;
                } else {
                    total += reward;
                }

                setValue('total', formatNumber(total));

                toggleBlocked();
                setTimeout(() => {
                    generateLevel(nextLevel);
                    toggleBlocked();
                }, 1000);
            });
        });
}

generateLevel(1);

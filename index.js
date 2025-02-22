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
function formatPercent(num) {
  if (num === 0) {
    return '0%';
  }

  return `${num < 0.001 ? (num * 100).toExponential() : (num * 100).toFixed(2)}%`;
}

const renderChestReward = (reward) => `
    <div class="reward">
        💰<br />${formatNumber(reward)}
    </div>
`;
const renderChestLose = () => `
    <div class="reward lose">
        Lose
    </div>
`;
const renderChest = (reward) => `
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
        ${reward > 0 ? renderChestReward(reward) : renderChestLose()}
    </div>
`;
const renderResult = (level, total, chance) => `
    Reached level <span class="number">${level}⬆️</span>;
    Reward: <span class="number">${total}💰</span>;
    Chance: <span class="number">${formatPercent(chance)}</span>
`;
const rewards = [-1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const gameScreen = document.querySelector('#gameScreen');
const initialScreen = document.querySelector('#initialScreen');
let bestRecord = Number(localStorage.getItem('bestRecord')) ?? 0;
let bestLevel = Number(localStorage.getItem('bestLevel')) ?? 0;
let bestChance = Number(localStorage.getItem('bestChance')) ?? 0;

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
function renderStatistic(level, formatCount) {
  setValue('level', level);
  setValue('minReward', rewards[1] * level);
  setValue('maxReward', rewards[formatCount - 1] * level);
  setValue('bestRecord', formatNumber(bestRecord));
  setValue('bestLevel', bestLevel);
  setValue('bestChance', formatPercent(bestChance));
}
function generateLevel(level, total, formatCount) {
  renderStatistic(level, formatCount);
  gameScreen.innerHTML = '';
  shuffle(rewards.slice(0, formatCount)).forEach((reward) => {
    gameScreen.insertAdjacentHTML('afterbegin', renderChest(reward * level));
  });
  document.querySelectorAll('.chest-container').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.currentTarget.querySelector('.chest').classList.add('hidden');
      setTimeout(() => {
        document.querySelectorAll('.chest:not(.hidden)').forEach((element) => {
          element.classList.add('hidden');
        });
      }, 300);

      const reward = Number(event.currentTarget.dataset.reward);
      const chance = Math.pow((formatCount - 1) / formatCount, level - 1);
      let nextLevel = level + 1;

      if (reward < 0) {
        if (bestChance === 0 || chance < bestChance) {
          bestRecord = total;
          bestLevel = level;
          bestChance = chance;
          localStorage.setItem('bestRecord', bestRecord);
          localStorage.setItem('bestLevel', bestLevel);
          localStorage.setItem('bestChance', bestChance);
          renderStatistic(level, formatCount);
        }

        toggleBlocked();
        setTimeout(() => {
          document.querySelector('#runResult').innerHTML = renderResult(
            level,
            total,
            chance,
          );
          toggleScreen();
          toggleBlocked();
        }, 2000);

        return;
      }

      total += reward;
      setValue('total', formatNumber(total));

      toggleBlocked();
      setTimeout(() => {
        generateLevel(nextLevel, total, formatCount);
        toggleBlocked();
      }, 2000);
    });
  });
}

const chestCountInput = document.querySelector('#chestCount');
function getChestCount() {
  const chestCount = Number(chestCountInput.value) ?? 4;

  return Math.max(
    Number(chestCountInput.min),
    Math.min(Number(chestCountInput.max), chestCount),
  );
}
function onStart(event) {
  event.preventDefault();
  generateLevel(1, 0, getChestCount());
  toggleScreen();
}

renderStatistic(1, getChestCount());
chestCountInput.addEventListener('change', () => {
  const count = getChestCount();

  chestCountInput.value = count;
  renderStatistic(1, count);
});
initialScreen.addEventListener('submit', onStart);

document.addEventListener('keydown', (event) => {
  let index = Number(event.key);
  index = index === 0 ? 10 : index;
  index -= 1;

  if (index >= 0 && index <= 9) {
    document.querySelectorAll('.chest').item(index)?.click();
  }
});

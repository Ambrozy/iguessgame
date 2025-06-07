import { useEffect, useState } from 'react';

const rewards = [-1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const shuffle = (arr) => {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const formatNumber = (num) => (num >= 1000 ? num.toExponential() : num);
const formatPercent = (num) => {
  if (num === 0) return '0%';
  return `${num < 0.001 ? (num * 100).toExponential() : (num * 100).toFixed(2)}%`;
};

function Chest({ reward, opened, onOpen }) {
  return (
    <div className="chest-container" onClick={opened ? undefined : onOpen}>
      <div className={`chest${opened ? ' hidden' : ''}`}> 
        <div className="lid" />
        <div className="left-corner" />
        <div className="right-corner" />
        <div className="left-box" />
        <div className="right-box" />
        <div className="top-box" />
        <div className="bottom-box" />
        <div className="lock" />
      </div>
      {opened && (
        reward > 0 ? (
          <div className="reward">💰<br />{formatNumber(reward)}</div>
        ) : (
          <div className="reward lose">Lose</div>
        )
      )}
    </div>
  );
}

export default function App() {
  const [bestRecord, setBestRecord] = useState(() => Number(localStorage.getItem('bestRecord')) || 0);
  const [bestLevel, setBestLevel] = useState(() => Number(localStorage.getItem('bestLevel')) || 0);
  const [bestChance, setBestChance] = useState(() => Number(localStorage.getItem('bestChance')) || 0);

  const [chestCount, setChestCount] = useState(4);
  const [level, setLevel] = useState(1);
  const [total, setTotal] = useState(0);
  const [chests, setChests] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [runResult, setRunResult] = useState('');

  const minChest = 2;
  const maxChest = 10;

  const generateChests = (lvl, count) => {
    const data = shuffle(rewards.slice(0, count)).map((r) => ({ reward: r * lvl, opened: false }));
    setChests(data);
  };

  const startGame = () => {
    const count = Math.max(minChest, Math.min(maxChest, chestCount));
    setChestCount(count);
    setLevel(1);
    setTotal(0);
    setRunResult('');
    setGameActive(true);
    generateChests(1, count);
  };

  const openChest = (index) => {
    if (blocked || chests[index].opened) return;
    setChests((prev) => prev.map((c, i) => (i === index ? { ...c, opened: true } : c)));
    setBlocked(true);

    const reward = chests[index].reward;
    const chance = Math.pow((chestCount - 1) / chestCount, level - 1);

    setTimeout(() => {
      setChests((prev) => prev.map((c) => ({ ...c, opened: true })));
    }, 300);

    if (reward < 0) {
      if (bestChance === 0 || chance < bestChance) {
        setBestRecord(total);
        setBestLevel(level);
        setBestChance(chance);
        localStorage.setItem('bestRecord', total);
        localStorage.setItem('bestLevel', level);
        localStorage.setItem('bestChance', chance);
      }
      setTimeout(() => {
        setRunResult(
          `Reached level ${level}⬆️; Reward: ${formatNumber(total)}💰; Chance: ${formatPercent(chance)}`,
        );
        setGameActive(false);
        setBlocked(false);
      }, 2000);
    } else {
      const newTotal = total + reward;
      setTotal(newTotal);
      setTimeout(() => {
        const next = level + 1;
        setLevel(next);
        generateChests(next, chestCount);
        setBlocked(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      let idx = Number(e.key);
      idx = idx === 0 ? 10 : idx;
      idx -= 1;
      if (idx >= 0 && idx < chests.length) {
        openChest(idx);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [chests]);

  return (
    <>
      <div className="toolbar">
        Be careful, one of the slot is a trap.<br />
        Best Level: <span className="number">{bestLevel}</span>;
        Best Reward: <span className="number">{formatNumber(bestRecord)}</span>;
        Best Chance: <span className="number">{formatPercent(bestChance)}</span>
        <br />
        Total: <span className="number">{formatNumber(total)}</span>;
        Level: <span className="number">{level}</span>;
        Reward: <span className="number">{formatNumber(rewards[1] * level)}–{formatNumber(rewards[chestCount - 1] * level)}</span>;
      </div>
      <div className="container">
        {!gameActive ? (
          <form className="screen" onSubmit={(e) => { e.preventDefault(); startGame(); }}>
            <div id="runResult">{runResult}</div>
            <button id="start" type="submit">Start</button>
            <br />
            <label htmlFor="chestCount">Number of chests:</label>
            <input
              id="chestCount"
              type="number"
              min={minChest}
              max={maxChest}
              value={chestCount}
              onChange={(e) => setChestCount(Number(e.target.value))}
            />
          </form>
        ) : (
          <div className={`screen${blocked ? ' blocked' : ''}`}> 
            {chests.map((c, i) => (
              <Chest key={i} reward={c.reward} opened={c.opened} onOpen={() => openChest(i)} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

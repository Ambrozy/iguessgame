export const rewards = [-1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export const shuffle = (arr) => {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const formatNumber = (num) => (num >= 1000 ? num.toExponential() : num);

export const formatPercent = (num) => {
  if (num === 0) return '0%';
  return `${num < 0.001 ? (num * 100).toExponential() : (num * 100).toFixed(2)}%`;
};

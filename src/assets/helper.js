export const addClass = (draw, number) =>
  draw.indexOf(number) !== -1 ? "match animated flash" : "default";
export const getRandom = () => Math.floor(Math.random() * (48 - 1)) + 1;
export const getRandomCombination = size => {
  let random;
  const joined = [];

  while (joined.length < size) {
    random = getRandom();
    if (joined.indexOf(random) === -1) {
      joined.push(random);
    }
  }
  return joined;
};

export const generateNumbers = () => {
  const temp = [];
  for (let i = 1; i <= 48; i++) {
    temp.push(i);
  }
  return temp;
};

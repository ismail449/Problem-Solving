snail = function (array) {
  let upperYLimit = array[0]?.length - 1 ?? 0;
  let upperXLimit = array[1]?.length - 1 ?? 0;
  let lowerYLimit = 0;
  let lowerXLimit = 0;
  let xIndex = 0;
  let yIndex = 0;
  let willSub = false;
  let result = [];
  while (upperYLimit >= lowerYLimit) {
    if (willSub) {
      for (let i = upperYLimit; i >= lowerYLimit; i--) {
        element = array[xIndex][i];
        result.push(element);
        yIndex = i;
      }
      for (let i = upperXLimit; i >= lowerXLimit + 1; i--) {
        element = array[i][yIndex];
        result.push(element);
        xIndex = i;
      }
      lowerXLimit++;
      lowerYLimit++;
    } else {
      for (let i = lowerYLimit; i <= upperYLimit; i++) {
        element = array[xIndex][i];
        result.push(element);
        yIndex = i;
      }
      for (let i = lowerXLimit + 1; i <= upperXLimit; i++) {
        element = array[i][yIndex];
        result.push(element);
        xIndex = i;
      }
      upperXLimit--;
      upperYLimit--;
    }
    willSub = !willSub;
  }
  return result;
};

snailResult = snail([
  [1, 2, 3, 4, 5, 6],
  [20, 21, 22, 23, 24, 7],
  [19, 32, 33, 34, 25, 8],
  [18, 31, 36, 35, 26, 9],
  [17, 30, 29, 28, 27, 10],
  [16, 15, 14, 13, 12, 11],
]);
console.log(snailResult);

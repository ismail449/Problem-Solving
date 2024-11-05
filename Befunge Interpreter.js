function interpret(code) {
  var output = "";
  let rowIndex = 0;
  let columnIndex = 0;
  const plane = code.split("\n").map((row) => row.split(""));
  const directionsLogic = {
    right: () => (columnIndex = (columnIndex + 1) % plane[rowIndex].length),
    left: () => (columnIndex = (columnIndex - 1) % plane[rowIndex].length),
    down: () => (rowIndex = (rowIndex + 1) % plane.length),
    up: () => (rowIndex = (rowIndex - 1) % plane.length),
  };
  let stack = [];
  let directionLogic = directionsLogic.right;
  const instructionLogicArray = [
    {
      instruction: ">",
      isDirection: true,
      logic: () => directionsLogic.right,
    },
    {
      instruction: "<",
      isDirection: true,
      logic: () => directionsLogic.left,
    },
    {
      instruction: "v",
      isDirection: true,
      logic: () => directionsLogic.down,
    },
    {
      instruction: "^",
      isDirection: true,
      logic: () => directionsLogic.up,
    },
    {
      instruction: "?",
      isDirection: true,
      logic: () => {
        const randomNumber = Math.floor(Math.random() * 4);
        if (randomNumber === 0) {
          return directionsLogic.up;
        } else if (randomNumber === 1) {
          return directionsLogic.down;
        } else if (randomNumber === 2) {
          return directionsLogic.left;
        } else {
          return directionsLogic.right;
        }
      },
    },
    {
      instruction: ["_", "|"],
      isDirection: true,
      logic: () => {
        let direction;
        const instruction = plane[rowIndex][columnIndex];
        if (instruction === "_") {
          direction = stack.pop()
            ? directionsLogic.left
            : directionsLogic.right;
        } else if (instruction === "|") {
          direction = stack.pop() ? directionsLogic.up : directionsLogic.down;
        }
        return direction;
      },
    },
    {
      instruction: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      logic: () => stack.push(+plane[rowIndex][columnIndex]),
    },
    {
      instruction: ["+", "-", "*", "/", "%", "`"],
      logic: () => {
        const a = stack.pop();
        const b = stack.pop();
        const instruction = plane[rowIndex][columnIndex];
        let result = 0;
        switch (instruction) {
          case "+":
            result = a + b;
            break;
          case "-":
            result = b - a;
            break;
          case "*":
            result = a * b;
            break;
          case "/":
          case "%":
            if (a === 0) break;
            if (instruction === "/") result = Math.floor(b / a);
            if (instruction === "%") result = b % a;
            break;
          case "`":
            result = +(b > a);
            break;
          default:
            break;
        }
        stack.push(result);
      },
    },
    {
      instruction: "!",
      logic: () => stack.push(+!stack.pop()),
    },
    {
      instruction: '"',
      logic: () => {
        while (true) {
          directionLogic();
          const instruction = plane[rowIndex][columnIndex];
          if (instruction === '"') break;
          stack.push(instruction.charCodeAt(0));
        }
      },
    },
    {
      instruction: ",",
      logic: () => (output += String.fromCharCode(stack.pop())),
    },
    {
      instruction: ".",
      logic: () => {
        output += stack.pop();
      },
    },
    {
      instruction: ":",
      logic: () => {
        const topStackValue = stack.pop();
        topStackValue
          ? stack.push(topStackValue, topStackValue)
          : stack.push(0, 0);
      },
    },
    {
      instruction: "$",
      logic: () => stack.pop(),
    },
    {
      instruction: "\\",
      logic: () => {
        const topStackValues = stack.splice(-2);
        if (topStackValues.length === 0) {
          stack.push(0, 0);
        } else if (topStackValues.length === 1) {
          stack.push(topStackValues[0], 0);
        } else {
          stack.push(...[topStackValues[1], topStackValues[0]]);
        }
      },
    },
    {
      instruction: "p",
      logic: () => {
        const x = stack.pop();
        const y = stack.pop();
        const v = stack.pop();
        plane[x][y] = String.fromCharCode(v);
      },
    },
    {
      instruction: "g",
      logic: () => {
        const x = stack.pop();
        const y = stack.pop();
        stack.push(plane[x][y].charCodeAt(0));
      },
    },
    {
      instruction: "#",
      logic: () => directionLogic(),
    },
  ];

  while (true) {
    const instruction = plane[rowIndex][columnIndex];
    if (instruction === "@") break;
    const instructionElement = instructionLogicArray.find((element) =>
      element.instruction.includes(instruction)
    );
    if (!instructionElement) {
      directionLogic();
      continue;
    }
    if (instructionElement.isDirection) {
      directionLogic = instructionElement.logic();
    } else {
      instructionElement.logic();
    }
    directionLogic();
  }
  return output;
}

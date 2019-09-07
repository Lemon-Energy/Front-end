/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-05 09:37:10
 * @LastEditTime: 2019-08-09 18:05:19
 * @LastEditors: Please set LastEditors
 */
class OthelloPattern {
  constructor(
    // arr = [
    //   [1, 1, 1, 1, 1, 1, 1, 1],
    //   [0, 2, 1, 1, 2, 1, 2, 2],
    //   [1, 1, 1, 1, 1, 2, 2, 2],
    //   [1, 2, 1, 1, 2, 2, 2, 2],
    //   [1, 2, 1, 1, 0, 2, 1, 0],
    //   [1, 1, 1, 2, 1, 2, 2, 2],
    //   [1, 1, 1, 1, 1, 1, 2, 2],
    //   [2, 2, 2, 2, 2, 2, 2, 2]
    // ]
    arr = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  ) {
    this.arr = arr;
  }

  set history(value) {
    this.arr = value.map(item => item.slice());
    return;
  }

  move(x, y, color, checkOnly = false) {
    let ox = x;
    let oy = y;
    let count = 0;
    if (this.arr[y][x] !== 0) {
      return false;
    }

    let canMove = false;
    let directions = [
      [-1, -1],
      [-1, 1],
      [-1, 0],
      [1, -1],
      [1, 1],
      [1, 0],
      [0, 1],
      [0, -1]
    ];
    for (let direction of directions) {
      x = ox;
      y = oy;
      let directionCanMove = false;
      let hasOpposite = false;
      while (true) {
        x -= direction[0];
        y -= direction[1];
        if (x < 0 || x > 7 || (y < 0 || y > 7)) {
          break;
        }
        if (this.arr[y][x] === 3 - color) {
          hasOpposite = true;
        }
        if (this.arr[y][x] === color) {
          if (hasOpposite) {
            directionCanMove = true;
          }
          break;
        }
        if (this.arr[y][x] === 0) {
          break;
        }
      }
      if (directionCanMove && checkOnly) {
        let countX = x;
        let countY = y;
        while (true) {
          if (countX === ox && countY === oy) {
            break;
          }
          countX += direction[0];
          countY += direction[1];
          if (countX !== ox || countY !== oy) {
            count++;
          }
        }
      }
      if (directionCanMove && !checkOnly) {
        while (true) {
          if (x === ox && y === oy) {
            break;
          }
          x += direction[0];
          y += direction[1];
          this.arr[y][x] = color;
        }
      }
      canMove = canMove || directionCanMove;
    }
    return { canMove, count };
  }
}

class OthelloGame {
  constructor() {
    this.pattern = new OthelloPattern();
    this.color = 2;
    this.portability = [
      { x: 4, y: 5, num: 4 },
      { x: 5, y: 4, num: 4 },
      { x: 2, y: 3, num: 4 },
      { x: 3, y: 2, num: 4 }
    ];
    this.history = [
      { color: 2, arr: this.pattern.arr.map(item => item.slice()) }
    ];
    this.optimal = void 0;
    this.Fraction = [
      [500, -25, 10, 5, 5, 10, -25, 500],
      [-25, -45, 1, 1, 1, 1, -45, -25],
      [10, 1, 3, 2, 2, 3, 1, 10],
      [5, 1, 2, 1, 1, 2, 1, 5],
      [5, 1, 2, 1, 1, 2, 1, 5],
      [10, 1, 3, 2, 2, 3, 1, 10],
      [-25, -45, 1, 1, 1, 1, -45, -25],
      [500, -25, 10, 5, 5, 10, -25, 500]
    ];
    this.staus = true;
  }
  checkPass() {
    let check = [];
    for (let y = 0; y < this.pattern.arr.length; y++) {
      for (let x = 0; x < this.pattern.arr[y].length; x++) {
        let move = this.pattern.move(x, y, this.color, true);
        if (move.canMove) {
          check.push({
            x,
            y,
            num: move.count
          });
        }
      }
    }
    if (check.length) {
      this.portability = check;
      return false;
    }
    this.portability = [];
    return true;
  }

  count(arr = this.pattern.arr) {
    let white = 0;
    let black = 0;
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        switch (arr[y][x]) {
          case 1:
            white++;
            break;
          case 2:
            black++;
            break;
        }
      }
    }
    return { white, black };
  }

  regret() {
    if (this.history.length > 2) {
      this.history.shift();
      this.pattern.history = this.history[0].arr;
      this.color = 3 - this.history[0].color;
      this.checkPass();
    } else if (this.history.length === 2) {
      this.history.shift();
      this.pattern.history = this.history[0].arr;
      this.color = this.history[0].color;
      this.checkPass();
    }
  }

  move(x, y) {
    if (this.pattern.move(x, y, this.color, false).canMove) {
      this.history.unshift({
        color: this.color,
        arr: this.pattern.arr.map(item => item.slice())
      });
      this.color = 3 - this.color;
      this.staus = false;
    }
    if (this.checkPass()) {
      console.log("passed");
      if (this.checkPass()) {
        console.log("Game Over");
      } else {
        this.color = 3 - this.color;
        this.staus = false;
      }
    }
  }

  sum(arr = this.pattern.arr, color = 1) {
    let sum = 0;
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        if (arr[y][x] === color) {
          sum = sum + this.Fraction[y][x] * (color === 1 ? 1 : -1);
        }
      }
    }
    return sum;
  }

  ai() {
    setTimeout(function(){
      this.staus = false;
    },5000)
  }
}

// class Ai extends OthelloGame{
//   constructor(){
//     super()
//   }

// }

// class Ai {
//   constructor() {
//     this.pattern = new OthelloPattern();
//     this.check = [];
//     this.result = [];
//     this.opp = 0;
//   }

//   count(arr) {
//     let white = 0;
//     let black = 0;
//     for (let y = 0; y < arr.length; y++) {
//       for (let x = 0; x < arr[y].length; x++) {
//         switch (arr[y][x]) {
//           case 1:
//             white++;
//             break;
//           case 2:
//             black++;
//             break;
//         }
//       }
//     }
//     return { white, black };
//   }

//   ai(
//     portability = [
//       { i: 0, x: 2, y: 3, num: 4 },
//       { i: 1, x: 3, y: 2, num: 4 },
//       { i: 2, x: 4, y: 5, num: 4 },
//       { i: 3, x: 5, y: 4, num: 4 }
//     ],
//     arr = this.pattern.arr,
//     color = 2,
//     check = this.check
//   ) {
//     for (let [i, position] of portability.entries()) {
//       let copy = arr.map(item => item.slice());
//       let copyPattern = new OthelloPattern(copy);
//       check = [];
//       copyPattern.move(position.x, position.y, color, false);
//       for (let y = 0; y < copyPattern.arr.length; y++) {
//         for (let x = 0; x < copyPattern.arr[y].length; x++) {
//           let move = copyPattern.move(x, y, 3 - color, true);
//           if (move.canMove) {
//             check.push({
//               i,
//               x,
//               y,
//               num:
//                 3 - color === 1
//                   ? this.count(copyPattern.arr).white + move.count
//                   : this.count(copyPattern.arr).black + move.count
//             });
//           }
//         }
//       }
//       if (check.length) {
//         this.opp++;
//         this.ai(check, copy, 3 - color, []);
//       }
//     }
//   }
// }

import { GameBrick } from './brick.js';
/**
 * 操控方塊遊戲本身
 */
class Game {
  /**
   * 初始化遊戲
   * @param {number} brickCount - 方塊數量
   */
  constructor(app) {
    this.app = app;

    let bricksNumber = [];
    for (let i = 1; i <= this.app.brickCount; i++) {
      const brick = {
        front: i,
        back: i,
        left: i,
        right: i,
        top: Math.floor(Math.random() * this.app.brickCount + 1),
        bottom: Math.floor(Math.random() * this.app.brickCount + 1),
      };
      bricksNumber.push(brick);
    }
    // 打亂同一側面
    ['front', 'back', 'left', 'right'].forEach((face) => {
      for (let bid = 0; bid < this.app.brickCount - 1; bid++) {
        const bid2 = Math.floor(Math.random() * (this.app.brickCount - bid) + bid);
        [bricksNumber[bid][face], bricksNumber[bid2][face]] =
          [bricksNumber[bid2][face], bricksNumber[bid][face]];
      }
    });

    // 打亂單個 brick
    for (let brickId = 0; brickId < this.app.brickCount; brickId++) {
      for (let i = 0; i < 10; i++) {
        const dir = Math.floor(Math.random() * 3);
        const angle = Math.floor(Math.random() * 3 + 1);
        for (let j = 0; j < angle; j++) {
          switch (dir) {
            case 0:
              [
                bricksNumber[brickId].top,
                bricksNumber[brickId].left,
                bricksNumber[brickId].bottom,
                bricksNumber[brickId].right,
              ] =
                [
                  bricksNumber[brickId].right,
                  bricksNumber[brickId].top,
                  bricksNumber[brickId].left,
                  bricksNumber[brickId].bottom,
                ];
              break;
            case 1:
              [
                bricksNumber[brickId].top,
                bricksNumber[brickId].front,
                bricksNumber[brickId].bottom,
                bricksNumber[brickId].back,
              ] =
                [
                  bricksNumber[brickId].back,
                  bricksNumber[brickId].top,
                  bricksNumber[brickId].front,
                  bricksNumber[brickId].bottom,
                ];
              break;
            case 2:
              [
                bricksNumber[brickId].front,
                bricksNumber[brickId].right,
                bricksNumber[brickId].back,
                bricksNumber[brickId].left,
              ] =
                [
                  bricksNumber[brickId].left,
                  bricksNumber[brickId].front,
                  bricksNumber[brickId].right,
                  bricksNumber[brickId].back,
                ];
              break;
          }
        }
      }
    }

    /**
     * 初始化 Brick class
     * @todo 編號應該要統一
     */
    this.bricks = [];
    bricksNumber.forEach((brick, brickId) => {
      this.bricks.push(new GameBrick(this.app, brickId, {
        top: brick['top'] - 1,
        bottom: brick['bottom'] - 1,
        front: brick['front'] - 1,
        back: brick['back'] - 1,
        right: brick['right'] - 1,
        left: brick['left'] - 1,
      }));
    });

    this.app.displayer.setGameBricks(this.bricks);

    this.timeCounter = 0;
    this.stepCounter = 0;
    this.start();
  }

  start() {
    this.isPause = false;
    this.lastStartTime = Date.now() / 1000;
  }

  pause() {
    this.isPause = true;
    this.timeCounter += (Date.now() / 1000 - this.lastStartTime);
  }

  getTime() {
    if (this.isPause) {
      return this.timeCounter;
    } else {
      return (Date.now() / 1000 - this.lastStartTime) + this.timeCounter;
    }
  }

  timePadding(n) {
    if (n < 10) {
      return '0' + n;
    }
    return n;
  }

  getTimeFormatted() {
    let time = this.getTime();
    let result = '';
    if (time > 3600) {
      result += Math.floor(time / 3600) + ':';
      time -= Math.floor(time / 3600) * 3600;
    }
    if (time > 60) {
      result += this.timePadding(Math.floor(time / 60)) + ':';
      time -= Math.floor(time / 60) * 60;
    }
    result += this.timePadding(Math.floor(time));
    time -= Math.floor(time);
    result += '.';
    result += this.timePadding(Math.floor(time * 100));
    return result;
  }

  getStep() {
    return this.stepCounter;
  }

  getStepFormatted() {
    return this.getStep();
  }

  /**
   * 以 x 為軸，朝向 x- 順時針旋轉
   * @param {number} brickId - 第幾個 Brick
   * @param {number} angle - 旋轉了幾個90度，應為1~3
   */
  rotateX(brickId, angle) {
    if (!Number.isInteger(angle)) {
      throw Error('angle is not a integer');
    }

    angle = (angle % 4 + 4) % 4;

    for (let i = 0; i < angle; i++) {
      [
        this.bricks[brickId].facePattern.top,
        this.bricks[brickId].facePattern.left,
        this.bricks[brickId].facePattern.bottom,
        this.bricks[brickId].facePattern.right,
      ] =
        [
          this.bricks[brickId].facePattern.right,
          this.bricks[brickId].facePattern.top,
          this.bricks[brickId].facePattern.left,
          this.bricks[brickId].facePattern.bottom,
        ];
    }
    this.stepCounter++;
  }

  /**
   * 以 y 為軸，朝向 y- 順時針旋轉
   * @param {number} brickId - 第幾個 Brick
   * @param {number} angle - 旋轉了幾個90度，應為1~3
   */
  rotateY(brickId, angle) {
    if (!Number.isInteger(angle)) {
      throw Error('angle is not a integer');
    }

    angle = (angle % 4 + 4) % 4;

    for (let i = 0; i < angle; i++) {
      [
        this.bricks[brickId].facePattern.top,
        this.bricks[brickId].facePattern.front,
        this.bricks[brickId].facePattern.bottom,
        this.bricks[brickId].facePattern.back,
      ] =
        [
          this.bricks[brickId].facePattern.back,
          this.bricks[brickId].facePattern.top,
          this.bricks[brickId].facePattern.front,
          this.bricks[brickId].facePattern.bottom,
        ];
    }
    this.stepCounter++;
  }

  /**
   * 以 z 為軸，朝向 z- 順時針旋轉
   * @param {number} brickId - 第幾個 Brick
   * @param {number} angle - 旋轉了幾個90度，應為1~3
   */
  rotateZ(brickId, angle) {
    if (!Number.isInteger(angle)) {
      throw Error('angle is not a integer');
    }

    angle = (angle % 4 + 4) % 4;

    for (let i = 0; i < angle; i++) {
      [
        this.bricks[brickId].facePattern.front,
        this.bricks[brickId].facePattern.right,
        this.bricks[brickId].facePattern.back,
        this.bricks[brickId].facePattern.left,
      ] =
        [
          this.bricks[brickId].facePattern.left,
          this.bricks[brickId].facePattern.front,
          this.bricks[brickId].facePattern.right,
          this.bricks[brickId].facePattern.back,
        ];
    }

    this.stepCounter++;
  }

  /**
   * @return {boolean} - 是否通關
   */
  isResolve() {
    let result = true;
    ['front', 'back', 'left', 'right'].forEach((face) => {
      const temp = [];
      for (let bid = 0; bid < this.app.brickCount; bid++) {
        temp[this.bricks[bid].facePattern[face]] = 1;
      }
      let sum = 0;
      for (let bid = 0; bid < this.app.brickCount; bid++) {
        sum += temp[bid];
      }
      if (sum != this.app.brickCount) {
        result = false;
      }
    });
    return result;
  }
}


export { Game };

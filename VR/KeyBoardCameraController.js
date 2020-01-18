import { Vector3, Quaternion } from 'three';

const SPEED = 0.1;
const MOVING_DISTANCE = 0.1;
const JUMP_HEIGHT = 30;

class ObjectNotation {
  position = null;
  quaternion = null;

  constructor(position, quaternion) {
    this.position = position;
    this.quaternion = quaternion;
  }

  translateOnAxis = (axis, distance) => {
    const v1 = new Vector3();

    v1.copy(axis).applyQuaternion(this.quaternion);

    this.position.add(v1.multiplyScalar(distance));
  };

  translateX = distance => {
    this.translateOnAxis(new Vector3(1, 0, 0), distance);
  };
  translateY = distance => {
    this.translateOnAxis(new Vector3(0, 1, 0), distance);
  };
  translateZ = distance => {
    this.translateOnAxis(new Vector3(0, 0, 1), distance);
  };
}

export default class KeyboardCameraController {
  _movingZ = 0;
  _movingX = 0;
  _movingY = 0;

  constructor() {
    document.addEventListener('keydown', event => this._onKeyDown(event));
    // document.addEventListener('up', (event) => this._onKeyUp(event));
    document.addEventListener('onmousemove', event =>
      console.log(event.clientX, event.clientY)
    );

    window.addEventListener(
      'message',
      event => {
        if (event.data.type === 'KEYBOARD_CAMERA_CONTROLLER_MESSAGE') {
          if (event.data.direction === 'UP') {
            this._moveForward();
          } else if (event.data.direction === 'DOWN') {
            this._moveBackward();
          } else if (event.data.direction === 'LEFT') {
            this._moveLeft();
          } else if (event.data.direction === 'RIGHT') {
            this._moveRight();
          } else if (event.data.direction === 'SPACE') {
            this._jump();
          }
        }
      },
      false
    );
  }

  _moveForward = () => {
    this._movingZ = -SPEED;
  };

  _moveBackward = () => {
    this._movingZ = SPEED;
  };

  _moveLeft = () => {
    this._movingX = -SPEED;
  };

  _moveRight = () => {
    this._movingX = SPEED;
  };

  _jump = () => {
    this._movingY = SPEED;
  };

  // _onKeyDown = (event) => {
  // }

  _onKeyDown = event => {
    if (event.keyCode === 38 || event.keyCode === 87) {
      this._moveForward();
    } else if (event.keyCode === 40 || event.keyCode === 83) {
      this._moveBackward();
    } else if (event.keyCode === 37 || event.keyCode === 65) {
      this._moveLeft();
    } else if (event.keyCode === 39 || event.keyCode === 68) {
      this._moveRight();
    } else if (event.keyCode === 32) {
      this._jump();
    }
  };

  fillCameraProperties(positionArray, rotationArray) {
    if (this._movingZ === 0 && this._movingX === 0 && this._movingY === 0) {
      return false;
    }

    const quaternion = new Quaternion(
      rotationArray[0],
      rotationArray[1],
      rotationArray[2],
      rotationArray[3]
    );
    const position = new Vector3(
      positionArray[0],
      positionArray[1],
      positionArray[2]
    );

    const cameraObjectNotation = new ObjectNotation(position, quaternion);

    if (this._movingZ !== 0) {
      cameraObjectNotation.translateZ(this._movingZ);

      this._movingZ += this._movingZ;
      if (Math.abs(this._movingZ) >= MOVING_DISTANCE) {
        this._movingZ = 0;
      }

      positionArray[0] = cameraObjectNotation.position.x;
      // positionArray[1] = cameraObjectNotation.position.y; // i don't want to fly
      positionArray[2] = cameraObjectNotation.position.z;
    }

    if (this._movingX !== 0) {
      cameraObjectNotation.translateX(this._movingX);

      this._movingX += this._movingX;
      if (Math.abs(this._movingX) >= MOVING_DISTANCE) {
        this._movingX = 0;
      }

      positionArray[0] = cameraObjectNotation.position.x;
      // positionArray[1] = cameraObjectNotation.position.y; // i don't want to fly
      positionArray[2] = cameraObjectNotation.position.z;
    }

    if (this._movingY !== 0) {
      cameraObjectNotation.translateY(this._movingY);

      this._movingY += this._movingY;
      if (Math.abs(this._movingY) >= JUMP_HEIGHT) {
        this._movingY = -SPEED;
      }

      positionArray[1] = cameraObjectNotation.position.y; // i just want to fly

      if (positionArray[1] < 0) {
        // i don't want go to hell

        this._movingY = 0;
        positionArray[1] = 0;
      }
    }

    return true;
  }
}

class PlayerProto {
  constructor(r, c) {
    this.init(r, c)
  }

  init = (r, c) => {
    this._initMembers(r, c)
    this._initModels(r, c)
    this._initListeners()
  }

  dragged = () => {
    this._setRC()
  }

  update = () => {
    this._calculateAcceleration()
    this._doPhysics()
  }

  _calculateAcceleration = () => {
    if (this.movements.up) this.acc.z -= PLAYER_ACCELERATION
    if (this.movements.down) this.acc.z += PLAYER_ACCELERATION
    if (this.movements.left) this.acc.x -= PLAYER_ACCELERATION
    if (this.movements.right) this.acc.x += PLAYER_ACCELERATION
  }

  _doPhysics = () => {
    const now = performance.now()
    const delta = now - this.prevTime

    // INERTIA
    this.vel.x -= this.vel.x * PLAYER_INERTIA * delta
    this.vel.z -= this.vel.z * PLAYER_INERTIA * delta

    this.acc.multiplyScalar(delta)
    this.vel.add(this.acc)

    this.acc.set(0, 0, 0)

    const newPos = this.model.position.clone()
    newPos.add(this.vel)

    newPos.clamp(this._minPos, this._maxPos)

    this._setRC()

    this.model.position.lerp(newPos, PLAYER_LERP_FACTOR)

    this.prevTime = now
  }

  _setRC = () => {
    const { r, c } = getRCFromXZ(this.model.position.x, this.model.position.z)

    this.r = r
    this.c = c
  }

  _initMembers = (r, c) => {
    this.r = Math.floor(r)
    this.c = Math.floor(c)

    this.vel = new THREE.Vector3(0, 0, 0)
    this.acc = new THREE.Vector3(0, 0, 0)

    this.movements = {
      up: false,
      down: false,
      left: false,
      right: false
    }

    this.prevTime = performance.now()

    this._minPos = new THREE.Vector3(
      (-DIVISIONS / 2 + 0.5) * DIMENSION,
      -Infinity,
      (-DIVISIONS / 2 + 0.5) * DIMENSION
    )
    this._maxPos = new THREE.Vector3(
      (DIVISIONS / 2 - 0.5) * DIMENSION,
      Infinity,
      (DIVISIONS / 2 - 0.5) * DIMENSION
    )
  }

  _initModels = (r, c) => {
    this.model = playerMesh.clone()

    this.model.name = PLAYER_TAG

    moveToPositionOnGrid(this.model, r, c)

    scene.add(this.model)
    draggables.push(this.model)
  }

  _initListeners = () => {
    const scope = this

    const changeMovements = (keyCode, bool) => {
      switch (keyCode) {
        case 87:
        case 38:
          scope.movements.up = bool
          break
        case 65:
        case 37:
          scope.movements.left = bool
          break
        case 83:
        case 40:
          scope.movements.down = bool
          break
        case 68:
        case 39:
          scope.movements.right = bool
          break
      }
    }

    this.onKeyDown = event => {
      event.preventDefault()
      changeMovements(event.keyCode, true)
    }

    this.onKeyUp = event => {
      event.preventDefault()
      changeMovements(event.keyCode, false)
    }

    window.addEventListener('keydown', this.onKeyDown, false)
    window.addEventListener('keyup', this.onKeyUp, false)
  }
}

const Player = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) {
        const { r: tr, c: tc } = clampRC(Math.random() * DIVISIONS, Math.random() * DIVISIONS)
        instance = new PlayerProto(tr, tc)
      }
      return instance
    }
  }
})()

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
    if (this.movements.placeObstacle) {
      this._placeWall()
    }
  }

  _calculateAcceleration = () => {
    if (this.movements.up) this.acc.z -= PLAYER_ACCELERATION
    if (this.movements.down) this.acc.z += PLAYER_ACCELERATION
    if (this.movements.left) this.acc.x -= PLAYER_ACCELERATION
    if (this.movements.right) this.acc.x += PLAYER_ACCELERATION
  }

  _doPhysics = () => {
    const worldRef = World.getInstance()

    const now = performance.now()
    const delta = (now - this.prevTime) / 1000

    // INERTIA
    this.vel.x -= this.vel.x * PLAYER_INERTIA * delta
    this.vel.z -= this.vel.z * PLAYER_INERTIA * delta

    this.vel.add(this.acc)
    this.vel.multiplyScalar(delta)

    this.acc.set(0, 0, 0)

    const newPos = this.model.position.clone()
    newPos.add(this.vel)

    newPos.clamp(this._minPos, this._maxPos)

    const { r: newR, c: newC } = getRCFromXZ(newPos.x, newPos.z)
    if (newR !== this.r) {
      const node = worldRef.grid.getNodeFromRC(newR, this.c)
      if (!node.walkable) {
        const maxX = (this.r - DIVISIONS / 2) * DIMENSION + PLAYER_DIM / 2
        newPos.x -= (this.vel.x - maxX) * Math.sign(Number(newR > this.r))
      }
    }
    if (newC !== this.c) {
      const node = worldRef.grid.getNodeFromRC(this.r, newC)
      if (!node.walkable) {
        const maxZ = (this.c - DIVISIONS / 2) * DIMENSION + PLAYER_DIM / 2
        newPos.z -= (this.vel.z - maxZ) * Math.sign(Number(newC > this.z))
      }
    }

    this._setRC()

    this.model.position.lerp(newPos, PLAYER_LERP_FACTOR)

    this.vel.divideScalar(delta)

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
      right: false,
      placeObstacle: false
    }

    this.prevTime = performance.now()
    this.lastPlacedObstacle = performance.now()

    this._minPos = new THREE.Vector3(
      (-DIVISIONS / 2) * DIMENSION + PLAYER_DIM / 2,
      -Infinity,
      (-DIVISIONS / 2) * DIMENSION + PLAYER_DIM / 2
    )
    this._maxPos = new THREE.Vector3(
      (DIVISIONS / 2) * DIMENSION - PLAYER_DIM / 2,
      Infinity,
      (DIVISIONS / 2) * DIMENSION - PLAYER_DIM / 2
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
        case 32:
          scope.movements.placeObstacle = bool
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

  _placeWall = () => {
    const now = performance.now()
    if (now - this.lastPlacedObstacle > PLAYER_OBSTACLE_DELAY) {
      World.getInstance().addObstacle(this.r, this.c)
      this.lastPlacedObstacle = now
    }
  }
}

const Player = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) {
        const { r: tr, c: tc } = clampRC(
          Math.random() * DIVISIONS,
          Math.random() * DIVISIONS
        )
        instance = new PlayerProto(tr, tc)
      }
      return instance
    }
  }
})()

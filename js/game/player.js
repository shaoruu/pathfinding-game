class PlayerProto {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
    this._initModels()
    this._initListeners()
  }

  update = () => {
    if (this.dead) return

    this._calculateAcceleration()
    this._doPhysics()
    this._setFacing()
    this._rotatePlayer()
    this._interactWorld()

    if (this.movements.placeObstacle) this._placeWall()
    else if (this.movements.breakObstacle) this._breakWall()
  }

  reset = () => {
    this.dead = false

    this._resetScore()
    this._resetRC()
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

    if (Math.abs(this.vel.x) > Math.abs(this.vel.z)) {
      newPos.x = this._handleXCollisions(newPos)
      newPos.z = this._handleZCollisions(newPos)
    } else {
      newPos.z = this._handleZCollisions(newPos)
      newPos.x = this._handleXCollisions(newPos)
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

  _setFacing = () => {
    const { up, down, left, right } = this.movements

    if (up) this.facing = UP
    else if (down) this.facing = DOWN
    else if (left) this.facing = LEFT
    else if (right) this.facing = RIGHT
  }

  _interactWorld = () => {
    const worldRef = World.getInstance()

    // TREASURE DETECT
    const foundTreasure = worldRef.isTreasureAt(this.r, this.c)
    if (foundTreasure) {
      worldRef.removeTreasure(this.r, this.c)
      this._addScore()
    }

    // MONSTER DETECT
    const onMonster = Monsters.isOneOn(this.r, this.c)
    if (onMonster) {
      Player.gameover()
      this.dead = true
    }

    // WIN DETECT
    if (worldRef.treasures.size === 0) {
      Monsters.upgrade()
      World.upgrade()
    }
  }

  _initMembers = () => {
    this._resetRC()

    this.vel = new THREE.Vector3(0, 0, 0)
    this.acc = new THREE.Vector3(0, 0, 0)

    this.movements = {
      up: false,
      down: false,
      left: false,
      right: false,
      placeObstacle: false,
      breakObstacle: false
    }

    this.prevTime = performance.now()
    this.lastPlacedObstacle = performance.now()
    this.lastBrokeObstacle = performance.now()

    this._minPos = new THREE.Vector3(
      (-DIVISIONS / 2) * DIMENSION + PLAYER_RADIUS,
      -Infinity,
      (-DIVISIONS / 2) * DIMENSION + PLAYER_RADIUS
    )
    this._maxPos = new THREE.Vector3(
      (DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS,
      Infinity,
      (DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS
    )

    this.score = 0

    this.dead = false
  }

  _initModels = () => {
    this.model = playerMesh.clone()

    this.model.name = PLAYER_TAG

    moveToPositionOnGrid(this.model, this.r, this.c)

    scene.add(this.model)
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
        case 90:
        case 16:
          scope.movements.placeObstacle = bool
          break
        case 88:
        case 32:
          scope.movements.breakObstacle = bool
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

  _handleXCollisions = newPos => {
    let fixedX = newPos.x

    const worldRef = World.getInstance()

    const minRBounds = getGridUnitFromMap(newPos.x - PLAYER_RADIUS)
    const maxRBounds = getGridUnitFromMap(newPos.x + PLAYER_RADIUS)

    // BODY BLOCK
    const minCBounds = getGridUnitFromMap(this.model.position.z - PLAYER_RADIUS)
    const maxCBounds = getGridUnitFromMap(this.model.position.z + PLAYER_RADIUS)

    if (minRBounds !== this.r) {
      // THIS MEANS THE NEW POSITION IS OVER TO A LOWER R
      const node = worldRef.grid.getNodeFromRC(minRBounds, this.c)
      if (node && !node.walkable) {
        fixedX = (minRBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
      }

      // BODY BLOCK
      if (minCBounds !== this.c) {
        const node = worldRef.grid.getNodeFromRC(minRBounds, minCBounds)
        if (node && !node.walkable) {
          fixedX = (minRBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
        }
      } else if (maxCBounds !== this.c) {
        const node = worldRef.grid.getNodeFromRC(minRBounds, maxCBounds)
        if (node && !node.walkable) {
          fixedX = (minRBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
        }
      }
    } else if (maxRBounds !== this.r) {
      // THIS MEANS THE NEW POSITION IS OVER TO A UPPER R
      const node = worldRef.grid.getNodeFromRC(maxRBounds, this.c)
      if (node && !node.walkable) {
        fixedX = (maxRBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
      }

      // BODY BLOCK
      if (minCBounds !== this.c) {
        const node = worldRef.grid.getNodeFromRC(maxRBounds, minCBounds)
        if (node && !node.walkable) {
          fixedX = (maxRBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
        }
      } else if (maxCBounds !== this.c) {
        const node = worldRef.grid.getNodeFromRC(maxRBounds, maxCBounds)
        if (node && !node.walkable) {
          fixedX = (maxRBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
        }
      }
    }

    // newPos.x = fixedX
    return fixedX
  }

  _handleZCollisions = newPos => {
    let fixedZ = newPos.z

    const worldRef = World.getInstance()

    const minCBounds = getGridUnitFromMap(newPos.z - PLAYER_RADIUS)
    const maxCBounds = getGridUnitFromMap(newPos.z + PLAYER_RADIUS)

    // BODY BLOCK
    const minRBounds = getGridUnitFromMap(this.model.position.x - PLAYER_RADIUS)
    const maxRBounds = getGridUnitFromMap(this.model.position.x + PLAYER_RADIUS)

    if (minCBounds !== this.c) {
      const node = worldRef.grid.getNodeFromRC(this.r, minCBounds)
      if (node && !node.walkable) {
        fixedZ = (minCBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
      }

      // BODY BLOCK
      if (minRBounds !== this.r) {
        const node = worldRef.grid.getNodeFromRC(minRBounds, minCBounds)
        if (node && !node.walkable) {
          fixedZ = (minCBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
        }
      } else if (maxRBounds !== this.r) {
        const node = worldRef.grid.getNodeFromRC(maxRBounds, minCBounds)
        if (node && !node.walkable) {
          fixedZ = (minCBounds - DIVISIONS / 2 + 1) * DIMENSION + PLAYER_RADIUS + EPSILON
        }
      }
    } else if (maxCBounds !== this.c) {
      const node = worldRef.grid.getNodeFromRC(this.r, maxCBounds)
      if (node && !node.walkable) {
        fixedZ = (maxCBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
      }

      // BODY BLOCK
      if (minRBounds !== this.r) {
        const node = worldRef.grid.getNodeFromRC(minRBounds, maxCBounds)
        if (node && !node.walkable) {
          fixedZ = (maxCBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
        }
      } else if (maxRBounds !== this.r) {
        const node = worldRef.grid.getNodeFromRC(maxRBounds, maxCBounds)
        if (node && !node.walkable) {
          fixedZ = (maxCBounds - DIVISIONS / 2) * DIMENSION - PLAYER_RADIUS - EPSILON
        }
      }
    }

    return fixedZ
  }

  _addScore = () => {
    scoreEle.innerHTML = `Score: ${++this.score}`
    scoreEle.style.fontSize = '3.5vh'
    scoreEle.style.color = '#eeeeee'
    setTimeout(() => {
      scoreEle.style.fontSize = '3vh'
      scoreEle.style.color = '#a0a0a0'
    }, 1000)
  }

  _resetScore = () => {
    this.score = 0
    scoreEle.innerHTML = `Score: 0`
  }

  _rotatePlayer = () => {
    const rotation = -calcAngleDegrees(this.vel.x, this.vel.z) + Math.PI / 2
    tweenToRotation(this.model, rotation, 5)
  }

  _placeWall = () => {
    const now = performance.now()
    if (now - this.lastPlacedObstacle > PLAYER_OBSTACLE_DELAY) {
      World.getInstance().addObstacle(this.r, this.c)
      this.lastPlacedObstacle = now
    }
  }

  _breakWall = () => {
    const now = performance.now()
    if (now - this.lastBrokeObstacle > PLAYER_OBSTACLE_DELAY) {
      const worldRef = World.getInstance()
      const { up, down, left, right } = this.movements

      switch (this.facing) {
        case UP:
          worldRef.removeObstacle(this.r, this.c - 1)
          break
        case DOWN:
          worldRef.removeObstacle(this.r, this.c + 1)
          break
        case LEFT:
          worldRef.removeObstacle(this.r - 1, this.c)
          break
        case RIGHT:
          worldRef.removeObstacle(this.r + 1, this.c)
          break
      }

      this.lastBrokeObstacle = now
    }
  }

  _resetRC = () => {
    let r, c
    while (true) {
      const { r: mr, c: mc } = clampRC(
        Math.floor(Math.random() * DIVISIONS),
        Math.floor(Math.random() * DIVISIONS)
      )
      if (World.getInstance().grid.isWalkable(mr, mc)) {
        r = mr
        c = mc
        break
      }
    }
    this.r = r
    this.c = c
  }
}

const Player = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) {
        let r, c
        while (true) {
          const { r: tr, c: tc } = clampRC(
            Math.floor(Math.random() * DIVISIONS),
            Math.floor(Math.random() * DIVISIONS)
          )
          if (World.getInstance().grid.isWalkable(tr, tc)) {
            r = tr
            c = tc
            break
          }
        }
        instance = new PlayerProto(r, c)
      }
      return instance
    },
    gameover() {
      modalEle.style.top = '50%'
      Monsters.getInstances().forEach(monster => {
        monster.gameover()
      })
    },
    restart() {
      instance.reset()
    }
  }
})()

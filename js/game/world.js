class WorldProto {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
    this._initModels()
    this._initGrid()
    this._initTreasures(3)
  }

  render = () => {}

  addObstacle = (r, c) => {
    if (!this.grid.isWalkable(r, c)) return

    const temp = obstacleMesh.clone()
    moveToPositionOnGrid(temp, r, c, OBSTACLE_HEIGHT / 2)
    temp.name = getRCRep(r, c)

    this.grid.setObstacle(r, c)

    this.obstacleGroup.add(temp)

    // setTimeout(() => this.removeObstacle(r, c), OBSTACLE_LIFESPAN)
  }

  removeObstacle = (r, c) => {
    const obj = this.obstacleGroup.getObjectByName(getRCRep(r, c))
    if (obj) this.obstacleGroup.remove(obj)

    this.grid.removeObstacle(r, c)
  }

  removeTreasure = (r, c) => {
    const name = getTreasureRep(r, c)
    const obj = scene.getObjectByName(name)
    if (obj) scene.remove(obj)
    this.treasures.delete(name)
  }

  isTreasureAt = (r, c) => {
    const name = getTreasureRep(r, c)
    return this.treasures.has(name)
  }

  getObstacleMeshes = () => {
    return this.obstacleGroup.children
  }

  update = () => {}

  upgrade = () => {
    this.treasures.forEach(treasure => {
      removeObjFromSceneByName(treasure.name)
    })

    if (this.level % 3 === 0) this.treasureCount++

    this._initTreasures(this.treasureCount)
    this._advanceLevel()
  }

  reset = () => {
    this.treasures.forEach(treasure => {
      removeObjFromSceneByName(treasure.name)
    })

    this._initTreasures()
    this._resetLevel()
  }

  _initMembers = () => {
    this.wallGroup = new THREE.Group()

    this.obstacleGroup = new THREE.Group()

    this.grid = new Grid()

    this.prevTime = performance.now()

    this.treasureCount = 3

    this.level = 1
  }

  _initModels = () => {
    this.platform = platformMesh
    scene.add(this.platform)

    for (let r = -1; r <= DIVISIONS; r++)
      for (let c = -1; c <= DIVISIONS; c++) {
        if (isWall(r, c)) this._addWall(r, c)
      }
    scene.add(this.wallGroup)

    scene.add(this.obstacleGroup)
  }

  _initGrid = () => {
    for (let r = 0; r < DIVISIONS; r++) {
      for (let c = 0; c < DIVISIONS; c++) {
        if (shouldObstacle(r, c)) {
          this.addObstacle(r, c)
        }
      }
    }
  }

  _initTreasures = (count = 3) => {
    this.treasures = new Map()
    for (let i = 0; i < count; i++) {
      const newT = new Treasure()
      this.treasures.set(newT.model.name, newT)
    }
  }

  _addWall = (r, c) => {
    const temp = wallMesh.clone()
    moveToPositionOnGrid(temp, r, c)
    temp.name = getRCRep(r, c)

    this.wallGroup.add(temp)
  }

  _advanceLevel = () => {
    levelEle.innerHTML = `Level ${++this.level}`
  }

  _resetLevel = () => {
    this.level = 1
    levelEle.innerHTML = `Level 1`
  }
}

const World = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) instance = new WorldProto()
      return instance
    },
    upgrade() {
      instance.upgrade()
    },
    restart() {
      instance.reset()
    }
  }
})()

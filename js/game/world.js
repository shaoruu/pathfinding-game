class WorldProto {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
    this._initModels()
  }

  render = () => {}

  addObstacle = (r, c) => {
    const temp = obstacleMesh.clone()
    moveToPositionOnGrid(temp, r, c)
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

  update = () => {}

  _initMembers = () => {
    this.wallGroup = new THREE.Group()

    this.obstacleGroup = new THREE.Group()

    this.grid = new Grid()

    this.prevTime = performance.now()
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

  _addWall = (r, c) => {
    const temp = wallMesh.clone()
    moveToPositionOnGrid(temp, r, c)
    temp.name = getRCRep(r, c)

    this.wallGroup.add(temp)
  }
}

const World = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) instance = new WorldProto()
      return instance
    }
  }
})()

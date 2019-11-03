class WorldProto {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
    this._initModels()

    this.findPath()
  }

  findPath = () => {
    this._resetPath()

    const startNode = this.grid.getNodeFromRC(this.monster.r, this.monster.c)
    const targetNode = this.grid.getNodeFromRC(this.target.r, this.target.c)

    const openSet = []
    const closedSet = []
    openSet.push(startNode)

    while (openSet.length > 0) {
      let node = openSet[0],
        index = 0
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fCost <= node.fCost) {
          if (openSet[i].hCost < node.hCost) {
            node = openSet[i]
            index = i
          }
        }
      }

      openSet.splice(index, 1)
      closedSet.push(node)

      if (equalNodes(node, targetNode)) {
        console.log('Found path')
        const nodes = retracePath(startNode, targetNode)

        console.log(nodes.length)

        nodes.forEach(({ r, c }, i) => {
          const colorI = Math.floor((255 * i) / nodes.length) / 255
          const tempMat = new THREE.MeshBasicMaterial()
          tempMat.color.setHSL(colorI, 0.5, 0.5)
          const tempMesh = new THREE.Mesh(pathSegmentGeo, tempMat)

          moveToPositionOnGrid(tempMesh, r, c)

          this.pathGroup.add(tempMesh)
        })

        return
      }

      const neighbors = this.grid.getDirectNeighborNodes(node)

      neighbors.forEach(neighbor => {
        if (!neighbor.walkable || closedSet.includes(neighbor)) {
          return
        }

        let newCostToNeighbor = node.gCost + getNodalDistance(node, neighbor)
        if (newCostToNeighbor < neighbor.gCost || !openSet.includes(neighbor)) {
          neighbor.gCost = newCostToNeighbor
          neighbor.hCost = getNodalDistance(neighbor, targetNode)
          neighbor.parent = node

          if (!openSet.includes(neighbor)) openSet.push(neighbor)
        }
      })
    }
  }

  render = () => {}

  objectDragged = name => {
    switch (name) {
      case MONSTER_TAG:
        this.monster.dragged()
        break
      case TARGET_TAG:
        this.target.dragged()
        break
      default:
        break
    }
    this.findPath()
  }

  addObstacle = (r, c) => {
    const temp = obstacleMesh.clone()
    moveToPositionOnGrid(temp, r, c)
    temp.name = getRCRep(r, c)

    this.grid.setObstacle(r, c)

    this.wallGroup.add(temp)
  }

  _initMembers = () => {
    this.wallGroup = new THREE.Group()

    this.pathGroup = new THREE.Group()

    this.obstacleGroup = new THREE.Group()

    const { r: mr, c: mc } = clampRC(Math.random() * DIVISIONS, Math.random() * DIVISIONS)
    this.monster = new Monster(mr, mc)
    const { r: tr, c: tc } = clampRC(Math.random() * DIVISIONS, Math.random() * DIVISIONS)
    this.target = new Target(tr, tc)

    this.grid = new Grid()
  }

  _initModels = () => {
    this.platform = platformMesh
    scene.add(this.platform)

    for (let r = -1; r <= DIVISIONS; r++)
      for (let c = -1; c <= DIVISIONS; c++) {
        if (isWall(r, c)) this._addWall(r, c)
      }
    scene.add(this.wallGroup)

    scene.add(this.pathGroup)

    scene.add(this.obstacleGroup)
  }

  _addWall = (r, c) => {
    const temp = wallMesh.clone()
    moveToPositionOnGrid(temp, r, c)
    temp.name = getRCRep(r, c)

    this.wallGroup.add(temp)
  }

  _resetPath = () => {
    this.grid.reset()

    for (let i = this.pathGroup.children.length - 1; i >= 0; i--)
      this.pathGroup.remove(this.pathGroup.children[i])
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

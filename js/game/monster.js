class MonsterProto {
  constructor(r, c) {
    this.init(r, c)
  }

  init = (r, c) => {
    this._initMembers(r, c)
    this._initModels(r, c)
  }

  dragged = () => {
    this._setRC()
  }

  findPathToPlayer = () => {
    this._resetPath()

    const gridRef = World.getInstance().grid
    const playerRef = Player.getInstance()

    const startNode = gridRef.getNodeFromRC(this.r, this.c)
    const targetNode = gridRef.getNodeFromRC(playerRef.r, playerRef.c)

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
        const nodes = retracePath(startNode, targetNode)

        this.direction = nodes[0]
        nodes.forEach(({ r, c }, index) => {
          const colorI = Math.floor((255 * index) / nodes.length) / 255
          const tempMat = new THREE.MeshBasicMaterial()
          tempMat.color.setHSL(colorI, 0.5, 0.5)
          const tempMesh = new THREE.Mesh(pathSegmentGeo, tempMat)

          moveToPositionOnGrid(tempMesh, r, c)

          this.pathGroup.add(tempMesh)
        })

        return
      }

      const neighbors = gridRef.getNeighborNodes(node)

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

    this.direction = null
  }

  update = () => {}

  _initMembers = (r, c) => {
    this.r = Math.floor(r)
    this.c = Math.floor(c)

    this.pathGroup = new THREE.Group()

    this.prevTime = performance.now()

    this.followPlayerInterval = setInterval(this._followPlayer, MONSTER_RECALC_DELAY)
  }

  _initModels = (r, c) => {
    this.model = monsterMesh.clone()

    this.model.name = MONSTER_TAG

    moveToPositionOnGrid(this.model, r, c)

    scene.add(this.model)
    draggables.push(this.model)

    scene.add(this.pathGroup)
  }

  _setRC = () => {
    const { r, c } = getRCFromXZ(this.model.position.x, this.model.position.z)

    this.r = r
    this.c = c
  }

  _followPlayer = () => {
    this.findPathToPlayer()

    if (!this.direction) return

    const deltaR = clamp(this.direction.r - this.r, -1, 1)
    const deltaC = clamp(this.direction.c - this.c, -1, 1)

    if (!this.tween) {
      const newR = this.r + deltaR,
        newC = this.c + deltaC

      this.tween = tweenToPositionOnGrid(this.model, newR, newC, MONSTER_RECALC_DELAY)
    }
    this.tween.onComplete(() => {
      this.tween = undefined
    })

    this._setRC()
  }

  _resetPath = () => {
    World.getInstance().grid.reset()

    for (let i = this.pathGroup.children.length - 1; i >= 0; i--)
      this.pathGroup.remove(this.pathGroup.children[i])
  }
}

const Monster = (function() {
  let instance = null

  return {
    getInstance() {
      if (!instance) {
        const { r: mr, c: mc } = clampRC(Math.random() * DIVISIONS, Math.random() * DIVISIONS)
        instance = new MonsterProto(mr, mc)
      }
      return instance
    }
  }
})()

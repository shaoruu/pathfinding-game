class MonsterProto {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
    this._initModels()
    this._initInterval()
  }

  update = () => {}

  gameover = () => {
    clearInterval(this.followPlayerInterval)
    clearTimeout(this.monsterSpawnTimeout)
  }

  reset = () => {
    this._resetRC()
    moveToPositionOnGrid(this.model, this.r, this.c)
    this._initInterval()
  }

  remove = () => {
    clearInterval(this.followPlayerInterval)
    clearTimeout(this.monsterSpawnTimeout)
    removeObjFromSceneByName(this.name)
  }

  _initMembers = () => {
    this._resetRC()

    this.pathGroup = new THREE.Group()

    this.prevTime = performance.now()

    this.name = getMonsterRep(this.r, this.c)
  }

  _initModels = () => {
    this.model = monsterMesh.clone()

    this.model.name = this.name

    moveToPositionOnGrid(this.model, this.r, this.c)

    scene.add(this.model)

    scene.add(this.pathGroup)
  }

  _initInterval = () => {
    this.monsterSpawnTimeout = setTimeout(() => {
      this.recalcDelay =
        (MONSTER_MAX_RECALC_DELAY - MONSTER_MIN_RECALC_DELAY) * Math.random() +
        MONSTER_MIN_RECALC_DELAY

      this.followPlayerInterval = setInterval(this._followPlayer, this.recalcDelay)
    }, MONSTER_SPAWN_DELAY)
  }

  _setRC = () => {
    const { r, c } = getRCFromXZ(this.model.position.x, this.model.position.z)

    this.r = r
    this.c = c
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

  _followPlayer = () => {
    const playerRef = Player.getInstance()
    const distanceToPlayer = Math.sqrt((this.r - playerRef.r) ** 2 + (this.c - playerRef.c) ** 2)
    if (distanceToPlayer > MONSTER_EYE_DIST) return

    this._findPathToPlayer()

    if (!this.direction) return

    const deltaR = clamp(this.direction.r - this.r, -1, 1)
    const deltaC = clamp(this.direction.c - this.c, -1, 1)

    if (!this.tween) {
      const newR = this.r + deltaR,
        newC = this.c + deltaC

      let rotation = 0
      if (deltaR > 0 && deltaC > 0) rotation = Math.PI / 4
      else if (deltaR > 0 && deltaC < 0) rotation = (3 * Math.PI) / 4
      else if (deltaR < 0 && deltaC > 0) rotation = -Math.PI / 4
      else if (deltaR < 0 && deltaC < 0) rotation = (-3 * Math.PI) / 4
      else if (deltaR < 0) rotation = -Math.PI / 2
      else if (deltaR > 0) rotation = Math.PI / 2
      else if (deltaC < 0) rotation = -Math.PI

      tweenToRotation(this.model, rotation)
      this.tween = tweenToPositionOnGrid(this.model, newR, newC, this.recalcDelay)
    }
    this.tween.onComplete(() => {
      this.tween = undefined
    })

    this._setRC()
  }

  _findPathToPlayer = () => {
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
        return
      }

      const neighbors = gridRef.getNeighborNodes(node)

      neighbors.forEach(neighbor => {
        if (
          isDiagonallyTrapped(node, neighbor) ||
          !neighbor.walkable ||
          closedSet.includes(neighbor)
        ) {
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

  _resetPath = () => {
    World.getInstance().grid.reset()

    for (let i = this.pathGroup.children.length - 1; i >= 0; i--)
      this.pathGroup.remove(this.pathGroup.children[i])
  }
}

const Monsters = (function() {
  let instances = new Map()
  let count

  return {
    getInstances() {
      return instances
    },
    getInstanceByName(name) {
      return instances.get(name)
    },
    addInstance() {
      const newInstance = new MonsterProto()
      instances.set(newInstance.name, newInstance)
      return newInstance
    },
    removeInstance(name) {
      instances.delete(name)
    },
    init(c) {
      count = c
      for (let i = 0; i < c; i++) {
        this.addInstance()
      }
    },
    isOneOn(r, c) {
      let isOn = false

      instances.forEach(monster => {
        if (monster.r === r && monster.c === c) isOn = true
      })

      return isOn
    },
    update() {
      instances.forEach(m => m.update())
    },
    upgrade() {
      this.addInstance()
    },
    restart() {
      instances.forEach(monster => {
        monster.remove()
      })
      instances.clear()
      this.init(count)
    }
  }
})()

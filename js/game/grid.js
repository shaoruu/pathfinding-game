// ! I DON"T KNOW WHAT DATA IS FOR

class Grid {
  constructor() {
    this.init()
  }

  init = () => {
    this._initMembers()
  }

  getNodeFromRC = (r, c) => {
    try {
      return this.nodes[r][c]
    } catch (e) {
      return null
    }
  }

  getDirectNeighborNodes = node => {
    const { r, c } = node
    const neighbors = [
      this.getNodeFromRC(r - 1, c),
      this.getNodeFromRC(r + 1, c),
      this.getNodeFromRC(r, c - 1),
      this.getNodeFromRC(r, c + 1)
    ].filter(ele => !!ele)

    return neighbors
  }

  getNeighborNodes = node => {
    const neighbors = []

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue

        let checkR = node.r + i
        let checkC = node.c + j

        if (rcWithinBounds(checkR, checkC)) {
          neighbors.push(this.getNodeFromRC(checkR, checkC))
        }
      }
    }

    return neighbors
  }

  setObstacle = (r, c) => {
    const node = this.getNodeFromRC(r, c)
    node.walkable = false
  }

  setData = (r, c, value) => {
    this.data[r * DIMENSION + c] = value
  }

  removeObstacle = (r, c) => {
    const node = this.getNodeFromRC(r, c)
    if (node) node.walkable = true
  }

  reset = () => {
    this.nodes.forEach(na => na.forEach(n => n.reset()))
  }

  isWalkable = (r, c) => {
    const node = this.getNodeFromRC(r, c)
    if (node) return node.walkable
    return false
  }

  _initMembers = () => {
    this.data = new Int32Array(DIMENSION * DIMENSION)

    this.nodes = []
    for (let i = 0; i < DIVISIONS; i++) {
      const newNodeArray = []
      for (let j = 0; j < DIVISIONS; j++) newNodeArray.push(new Node(true, i, j))
      this.nodes.push(newNodeArray)
    }
  }
}

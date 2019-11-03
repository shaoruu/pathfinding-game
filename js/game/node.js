class Node {
  constructor(_walkable, _r, _c) {
    this.walkable = _walkable
    this.r = _r
    this.c = _c

    this.gCost = 0
    this.hCost = 0

    this.parent = null
  }

  reset = () => {
    this.gCost = 0
    this.hCost = 0

    this.parent = null
  }

  get fCost() {
    return this.gCost + this.hCost
  }
}

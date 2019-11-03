class Monster {
  constructor(r, c) {
    this.init(r, c)
  }

  init = (r, c) => {
    this._initMembers(r, c)
    this._initModels(r, c)
  }

  dragged = () => {
    const { r, c } = getRCFromXZ(this.model.position.x, this.model.position.z)

    this.r = r
    this.c = c
  }

  _initMembers = (r, c) => {
    this.r = Math.floor(r)
    this.c = Math.floor(c)
  }

  _initModels = (r, c) => {
    this.model = monsterMesh.clone()

    this.model.name = MONSTER_TAG

    moveToPositionOnGrid(this.model, r, c)

    scene.add(this.model)
    draggables.push(this.model)
  }
}

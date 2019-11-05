class Treasure {
  constructor() {
    this._initMembers()
    this._initModel()
  }

  isOn = (r, c) => {
    return this.r === r && this.c === c
  }

  _initMembers = () => {
    const { r, c } = clampRC(
      Math.floor(Math.random() * DIVISIONS),
      Math.floor(Math.random() * DIVISIONS)
    )
    this.r = r
    this.c = c
  }

  _initModel = () => {
    this.name = getTreasureRep(this.r, this.c)

    this.model = treasureGroup.clone()
    this.model.name = this.name

    moveToPositionOnGrid(this.model, this.r, this.c, DIMENSION / 7)

    scene.add(this.model)
  }
}

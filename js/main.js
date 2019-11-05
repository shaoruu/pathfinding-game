function init() {
  World.getInstance()
  Monsters.init(2)
  Player.getInstance()
}

function render() {
  renderer.render(scene, camera)
}

function animate() {
  // stats.begin()

  controls.update()
  TWEEN.update()

  Player.getInstance().update()
  Monsters.update()
  World.getInstance().update()

  shaderTime.value = performance.now() / 1000

  render()

  // stats.end()

  requestAnimationFrame(animate)
}

init()
animate()

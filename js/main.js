function init() {
  World.getInstance()
  Monster.getInstance()
  Player.getInstance()
}

function render() {
  renderer.render(scene, camera)
}

function animate() {
  stats.begin()

  controls.update()
  TWEEN.update()

  Player.getInstance().update()
  Monster.getInstance().update()
  World.getInstance().update()

  shaderTime.value = performance.now() / 1000

  render()

  stats.end()

  requestAnimationFrame(animate)
}

init()
animate()

function decisionLoop() {
  // Monsters.update()
  window.setTimeout(decisionLoop, params.decisionInterval)
}

decisionLoop()

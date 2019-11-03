function init() {
  World.getInstance()
}

function render() {
  renderer.render(scene, camera)
}

function animate() {
  stats.begin()

  controls.update()
  TWEEN.update()

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

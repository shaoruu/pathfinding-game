function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

restartEle.addEventListener(
  'click',
  () => {
    Monsters.restart()
    Player.restart()
    World.restart()

    modalEle.style.top = '-50%'
  },
  false
)

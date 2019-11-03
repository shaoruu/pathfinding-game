function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

let isDragging
dragControls.addEventListener('dragstart', () => (isDragging = true))
dragControls.addEventListener('dragend', () => (isDragging = false))
dragControls.addEventListener('drag', ({ object }) => {
  World.getInstance().objectDragged(object.name)
})

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(0, 0)
const onClickPosition = new THREE.Vector2()

function onMouseMove(event) {
  event.preventDefault()
  if (!isDragging && event.buttons !== 0 && event.shiftKey) {
    onMouseDown({ button: RIGHT_CLICK, shiftKey: true }, true)
  }

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}

document.addEventListener('mousemove', onMouseMove, false)

function onMouseDown(evt, manual = false) {
  if (isDragging) return
  if (!manual) evt.preventDefault()

  const { button, shiftKey } = evt

  camera.lookAt(scene.position)
  raycaster.setFromCamera(mouse, camera)

  console.log(button)
  switch (button) {
    case LEFT_CLICK: {
      if (shiftKey) {
        // SHIFT + LEFT KEY
        return
      }
      // LEFT KEY
      return
    }
    case RIGHT_CLICK: {
      if (shiftKey) {
        // SHIFT + RIGHT KEY
        const platform = World.getInstance().platform
        const intersections = raycaster.intersectObject(platform)

        if (!intersections.length) return

        const { point } = intersections[0]
        const { r, c } = getRCFromXZ(point.x, point.z)

        World.getInstance().addObstacle(r, c)

        return
      }
      // RIGHT KEY
      return
    }
  }
}

window.addEventListener('mousedown', onMouseDown, false)

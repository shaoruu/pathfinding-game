// nodes.forEach(({ r, c }, index) => {
//   const colorI = Math.floor((255 * index) / nodes.length) / 255
//   const tempMat = new THREE.MeshBasicMaterial()
//   tempMat.color.setHSL(colorI, 0.5, 0.5)
//   const tempMesh = new THREE.Mesh(pathSegmentGeo, tempMat)

//   moveToPositionOnGrid(tempMesh, r, c)

//   this.pathGroup.add(tempMesh)
// })

// const raycaster = new THREE.Raycaster()
// const mouse = new THREE.Vector2(0, 0)
// const onClickPosition = new THREE.Vector2()

// function onMouseMove(event) {
//   event.preventDefault()

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
// }

// document.addEventListener('mousemove', onMouseMove, false)

// function onMouseDown(evt, manual = false) {
//   if (!manual) evt.preventDefault()

//   const { button, shiftKey } = evt

//   camera.lookAt(scene.position)
//   raycaster.setFromCamera(mouse, camera)

//   console.log(button)
//   switch (button) {
//     case LEFT_CLICK: {
//       if (shiftKey) {
//         // SHIFT + LEFT KEY
//         return
//       }
//       // LEFT KEY
//       return
//     }
//     case RIGHT_CLICK: {
//       if (shiftKey) {
//         // SHIFT + RIGHT KEY
//         const platform = World.getInstance().platform
//         const intersections = raycaster.intersectObject(platform)

//         if (!intersections.length) return

//         const { point } = intersections[0]
//         const { r, c } = getRCFromXZ(point.x, point.z)

//         World.getInstance().addObstacle(r, c)

//         return
//       }
//       // RIGHT KEY
//       return
//     }
//   }
// }

// window.addEventListener('mousedown', onMouseDown, false)

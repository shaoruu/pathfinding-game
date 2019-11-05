function isWall(r, c) {
  return r === DIVISIONS || r === -1 || c === DIVISIONS || c === -1
}

function getXZfromRC(r, c) {
  return {
    x: (r - DIVISIONS / 2) * DIMENSION + DIMENSION / 2,
    z: (c - DIVISIONS / 2) * DIMENSION + DIMENSION / 2
  }
}

function getGridUnitFromMap(value) {
  return Math.round((value - DIMENSION / 2) / DIMENSION + DIVISIONS / 2)
}

function getRCFromXZ(x, z) {
  const realRCoord = getGridUnitFromMap(x)
  const realCCoord = getGridUnitFromMap(z)

  return { r: realRCoord, c: realCCoord }
}

function getRCFromRep(rep) {
  const [int1, int2] = rep.split('::')
  return { r: parseInt(int1), c: parseInt(int2) }
}

function moveToPositionOnGrid(mesh, r, c, y = DIMENSION / 2) {
  // ASSUME `mesh` IS DIMENSION * DIMENSION * DIMENSION
  mesh.position.y = y

  const { x: realRPos, z: realCPos } = getXZfromRC(r, c)

  mesh.position.x = realRPos
  mesh.position.z = realCPos
}

function tweenToPositionOnGrid(mesh, r, c, delay = 10) {
  const { x, z } = getXZfromRC(r, c)

  return tweenToPositionOnMap(mesh, x, z, delay)
}

function tweenToPositionOnMap(mesh, x, z, delay = 10) {
  return (
    new TWEEN.Tween(mesh.position)
      .to({ x, z }, delay)
      // .easing(k => k)
      .start()
  )
}

function tweenToRotation(mesh, rotation, delay = 200) {
  return new TWEEN.Tween(mesh.rotation).to({ y: rotation }, delay).start()
}

function getRCRep(r, c) {
  return `${r}::${c}`
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

function clampPosToMap(vector) {
  vector.x = clamp(vector.x, -DIMENSION * (DIVISIONS / 2 - 0.5), DIMENSION * (DIVISIONS / 2 - 0.5))
  vector.y = clamp(vector.y, -DIMENSION * (DIVISIONS / 2 - 0.5), DIMENSION * (DIVISIONS / 2 - 0.5))
  vector.z = clamp(vector.z, -DIMENSION * (DIVISIONS / 2 - 0.5), DIMENSION * (DIVISIONS / 2 - 0.5))
}

function clampRC(r, c) {
  return { r: clamp(r, 0, DIVISIONS - 1), c: clamp(c, 0, DIVISIONS - 1) }
}

function getNodalDistance(node1, node2) {
  // let distR = Math.abs(node1.r - node2.r)
  // let distC = Math.abs(node1.c - node2.c)

  // if (distR > distC) return Math.round(14 * distC + 10 * (distR - distC))
  // return Math.round(14 * distR + 10 * (distC - distR))
  return Math.abs(node1.r - node2.r) + Math.abs(node1.c - node2.c)
}

function equalNodes(node1, node2) {
  return node1.r === node2.r && node1.c === node2.c
}

function retracePath(startNode, endNode) {
  const path = []
  let currNode = endNode

  while (!equalNodes(startNode, currNode)) {
    path.unshift(currNode)
    currNode = currNode.parent
  }

  return path
}

function mouseMoveWhilstDown(target, whileMove) {
  var endMove = function() {
    window.removeEventListener('mousemove', whileMove)
    window.removeEventListener('mouseup', endMove)
  }

  target.addEventListener('mousedown', function(event) {
    event.stopPropagation() // remove if you do want it to propagate ..
    window.addEventListener('mousemove', whileMove)
    window.addEventListener('mouseup', endMove)
  })
}

function getSimplex(r, c) {
  return (noise.simplex2(r / SIMPLEX_SCALE, c / SIMPLEX_SCALE) + 1) / 2
}

function shouldObstacle(r, c) {
  const value = getSimplex(r, c)
  return value >= 0.5 - NOISE_RANGE / 2 && value <= 0.5 + NOISE_RANGE / 2
}

function calcAngleDegrees(x, z) {
  return Math.atan2(z, x)
}

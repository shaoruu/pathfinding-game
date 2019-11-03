function isWall(r, c) {
  return r === DIVISIONS || r === -1 || c === DIVISIONS || c === -1
}

function getXZfromRC(r, c) {
  return {
    x: (r - DIVISIONS / 2) * DIMENSION + DIMENSION / 2,
    z: (c - DIVISIONS / 2) * DIMENSION + DIMENSION / 2
  }
}

function getRCFromXZ(x, z) {
  const realRCoord = Math.round((x - DIMENSION / 2) / DIMENSION + DIVISIONS / 2)
  const realCCoord = Math.round((z - DIMENSION / 2) / DIMENSION + DIVISIONS / 2)

  return { r: realRCoord, c: realCCoord }
}

function moveToPositionOnGrid(mesh, r, c) {
  // ASSUME `mesh` IS DIMENSION * DIMENSION * DIMENSION
  mesh.position.y = DIMENSION / 2

  const { x: realRPos, z: realCPos } = getXZfromRC(r, c)

  mesh.position.x = realRPos
  mesh.position.z = realCPos
}

function tweenToPositionOnGrid(mesh, r, c, delay = 10) {
  const { x, z } = getXZfromRC(r, c)

  return tweenToPositionOnMap(mesh, x, z, delay)
}

function tweenToPositionOnMap(mesh, x, z, delay = 10) {
  return new TWEEN.Tween(mesh.position)
    .to({ x, z }, delay)
    .easing(k => k)
    .start()
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

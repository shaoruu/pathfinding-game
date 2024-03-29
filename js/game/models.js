/* -------------------------------------------------------------------------- */
/*                                    TEST                                    */
/* -------------------------------------------------------------------------- */
// const testGeo = new THREE.BoxBufferGeometry(100, 100, 100)
// const testMat = new THREE.MeshBasicMaterial({ color: '#00adb5' })
// const testMesh = new THREE.Mesh(testGeo, testMat)

// scene.add(testMesh)

/* -------------------------------------------------------------------------- */
/*                                  MONSTERS                                  */
/* -------------------------------------------------------------------------- */
const monsterGeo = new THREE.IcosahedronBufferGeometry(MONSTER_RADIUS)
const monsterMaterial = new THREE.MeshLambertMaterial({ color: MONSTER_COLOR })
const monster = new THREE.Mesh(monsterGeo, monsterMaterial)

monsterMaterial.onBeforeCompile = shader => {
  shader.uniforms.time = shaderTime
  shader.vertexShader =
    `
         uniform float time;
         ` + shader.vertexShader
  const token = '#include <begin_vertex>'
  const customTransform = `
        vec3 transformed = vec3(position);
        transformed.x = position.x 
             + cos(position.y*10.0 + time*10.0) * 5.0;
    `
  shader.vertexShader = shader.vertexShader.replace(token, customTransform)
}

const monsterArrGeo = new THREE.ConeBufferGeometry(
  MONSTER_RADIUS / 4,
  MONSTER_RADIUS / 2,
  32
)
const monsterArrMat = new THREE.MeshLambertMaterial({ color: MONSTER_RAY_ARROW_COLOR })
const monsterArrMesh = new THREE.Mesh(monsterArrGeo, monsterArrMat)

monsterArrMesh.position.set(0, 0, MONSTER_RADIUS)
monsterArrMesh.rotation.set(Math.PI / 2, 0, 0)

const monsterMesh = new THREE.Group()

monsterMesh.add(monster)
monsterMesh.add(monsterArrMesh)
monsterMesh.position.y = MONSTER_RADIUS

/* -------------------------------------------------------------------------- */
/*                                   PLAYER                                   */
/* -------------------------------------------------------------------------- */
const playerGeo = new THREE.IcosahedronBufferGeometry(PLAYER_RADIUS)
const playerMaterial = new THREE.MeshLambertMaterial({ color: PLAYER_COLOR })
const player = new THREE.Mesh(playerGeo, playerMaterial)

playerMaterial.onBeforeCompile = shader => {
  shader.uniforms.time = shaderTime
  shader.vertexShader =
    `
         uniform float time;
         ` + shader.vertexShader
  const token = '#include <begin_vertex>'
  const customTransform = `
        vec3 transformed = vec3(position);
        transformed.x = position.x 
             + cos(position.y*10.0 + time*10.0) * 5.0;
    `
  shader.vertexShader = shader.vertexShader.replace(token, customTransform)
}

const playerArrGeo = new THREE.ConeBufferGeometry(
  PLAYER_RADIUS / 4,
  PLAYER_RADIUS / 2,
  32
)
const playerArrMat = new THREE.MeshLambertMaterial({ color: PLAYER_RAY_ARROW_COLOR })
const playerArrMesh = new THREE.Mesh(playerArrGeo, playerArrMat)

playerArrMesh.position.set(0, 0, PLAYER_RADIUS)
playerArrMesh.rotation.set(Math.PI / 2, 0, 0)

const playerMesh = new THREE.Group()

playerMesh.add(player)
playerMesh.add(playerArrMesh)
playerMesh.position.y = PLAYER_RADIUS

/* -------------------------------------------------------------------------- */
/*                                    WORLD                                   */
/* -------------------------------------------------------------------------- */
const platformGeo = new THREE.PlaneBufferGeometry(
  DIMENSION * DIVISIONS,
  DIMENSION * DIVISIONS
)
const platformMat = new THREE.MeshStandardMaterial({
  color: WORLD_PLATFORM_COLOR,
  roughness: 0.8
})
const platformMesh = new THREE.Mesh(platformGeo, platformMat)

platformMesh.rotation.x = -Math.PI / 2

const wallGeo = new THREE.BoxBufferGeometry(DIMENSION, DIMENSION, DIMENSION)
const wallMat = new THREE.MeshLambertMaterial({ color: WORLD_WALL_COLOR })
const wallMesh = new THREE.Mesh(wallGeo, wallMat)

// const monsterGeo = new THREE.BoxBufferGeometry(MONSTER_DIM, MONSTER_DIM, MONSTER_DIM)
// const monsterMat = new THREE.MeshBasicMaterial({ color: MONSTER_COLOR })
// const monsterMesh = new THREE.Mesh(monsterGeo, monsterMat)

// const playerGeo = new THREE.BoxBufferGeometry(PLAYER_DIM, PLAYER_DIM, PLAYER_DIM)
// const playerMat = new THREE.MeshBasicMaterial({ color: TARGET_COLOR })
// const playerMesh = new THREE.Mesh(playerGeo, playerMat)

const pathSegmentGeo = new THREE.BoxBufferGeometry(
  DIMENSION / 2,
  DIMENSION / 2,
  DIMENSION / 2
)
const pathSegmentMat = new THREE.MeshLambertMaterial({ color: PATH_COLOR })
const pathSegmentMesh = new THREE.Mesh(pathSegmentGeo, pathSegmentMat)

const obstacleGeo = new THREE.BoxBufferGeometry(DIMENSION, OBSTACLE_HEIGHT, DIMENSION)
const obstacleMat = new THREE.MeshStandardMaterial({
  color: OBSTACLE_COLOR,
  roughness: 0.8
  // opacity: OBSTACLE_OPACITY,
  // transparent: true
})
const obstacleMesh = new THREE.Mesh(obstacleGeo, obstacleMat)

const treasure1Geo = new THREE.BoxBufferGeometry(
  DIMENSION / 3,
  DIMENSION / 3,
  DIMENSION / 3
)
const treasure1Mat = new THREE.MeshStandardMaterial({
  color: 0xf45905
})
const treasure1Mesh = new THREE.Mesh(treasure1Geo, treasure1Mat)
treasure1Mesh.position.set(0, 0, 0)

const treasure2Geo = new THREE.BoxBufferGeometry(
  DIMENSION / 4,
  DIMENSION / 9,
  DIMENSION / 4
)
const treasure2Mat = new THREE.MeshStandardMaterial({ color: 0xc70d3a })
const treasure2Mesh = new THREE.Mesh(treasure2Geo, treasure2Mat)

treasure2Mesh.position.set(0, 0, 0)
treasure2Mesh.position.y = DIMENSION / 5

// const treasureLight = new THREE.PointLight(0x999900, 5, DIMENSION)
// treasureLight.position.copy(treasure1Mesh.position)

const treasureGroup = new THREE.Group()
treasureGroup.add(treasure1Mesh)
treasureGroup.add(treasure2Mesh)
// treasureGroup.add(treasureLight)

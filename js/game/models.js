/* -------------------------------------------------------------------------- */
/*                                    TEST                                    */
/* -------------------------------------------------------------------------- */
// const testGeo = new THREE.BoxBufferGeometry(100, 100, 100)
// const testMat = new THREE.MeshBasicMaterial({ color: '#00adb5' })
// const testMesh = new THREE.Mesh(testGeo, testMat)

// scene.add(testMesh)

/* -------------------------------------------------------------------------- */
/*                                    WORLD                                   */
/* -------------------------------------------------------------------------- */
const platformGeo = new THREE.PlaneBufferGeometry(
  DIMENSION * DIVISIONS,
  DIMENSION * DIVISIONS
)
const platformMat = new THREE.MeshBasicMaterial({ color: WORLD_PLATFORM_COLOR })
const platformMesh = new THREE.Mesh(platformGeo, platformMat)

platformMesh.rotation.x = -Math.PI / 2

const wallGeo = new THREE.BoxBufferGeometry(DIMENSION, DIMENSION, DIMENSION)
const wallMat = new THREE.MeshBasicMaterial({ color: WORLD_WALL_COLOR })
const wallMesh = new THREE.Mesh(wallGeo, wallMat)

const monsterGeo = new THREE.BoxBufferGeometry(MONSTER_DIM, MONSTER_DIM, MONSTER_DIM)
const monsterMat = new THREE.MeshBasicMaterial({ color: MONSTER_COLOR })
const monsterMesh = new THREE.Mesh(monsterGeo, monsterMat)

const playerGeo = new THREE.BoxBufferGeometry(PLAYER_DIM, PLAYER_DIM, PLAYER_DIM)
const playerMat = new THREE.MeshBasicMaterial({ color: TARGET_COLOR })
const playerMesh = new THREE.Mesh(playerGeo, playerMat)

const pathSegmentGeo = new THREE.BoxBufferGeometry(
  DIMENSION / 2,
  DIMENSION / 2,
  DIMENSION / 2
)
const pathSegmentMat = new THREE.MeshBasicMaterial({ color: PATH_COLOR })
const pathSegmentMesh = new THREE.Mesh(pathSegmentGeo, pathSegmentMat)

const obstacleGeo = new THREE.BoxBufferGeometry(DIMENSION, OBSTACLE_HEIGHT, DIMENSION)
const obstacleMat = new THREE.MeshBasicMaterial({
  color: OBSTACLE_COLOR,
  opacity: OBSTACLE_OPACITY,
  transparent: true
})
const obstacleMesh = new THREE.Mesh(obstacleGeo, obstacleMat)

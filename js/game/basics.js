/* -------------------------------------------------------------------------- */
/*                               SCENE CREATION                               */
/* -------------------------------------------------------------------------- */
const scene = new THREE.Scene()
scene.background = new THREE.Color(BACKGROUND_COLOR)
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 1, FOG_FAR)

/* -------------------------------------------------------------------------- */
/*                              RENDERER CREATION                             */
/* -------------------------------------------------------------------------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false)

/* -------------------------------------------------------------------------- */
/*                               CAMERA CREATION                              */
/* -------------------------------------------------------------------------- */
const camera = new THREE.PerspectiveCamera(
  60,
  canvas.offsetWidth / canvas.offsetHeight,
  1,
  CAMERA_FAR
)
camera.position.set(550, 850, 0)

/* -------------------------------------------------------------------------- */
/*                               ORBIT CONTROLS                               */
/* -------------------------------------------------------------------------- */
const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
controls.enablePan = false
controls.rotateSpeed = 0.02
controls.dampingFactor = 0.1
controls.screenSpacePanning = false
controls.minDistance = 100
controls.maxDistance = 1200
controls.minAzimuthAngle = 0
controls.maxAzimuthAngle = 0
controls.maxPolarAngle = Math.PI / 2

/* -------------------------------------------------------------------------- */
/*                                   LIGHTS                                   */
/* -------------------------------------------------------------------------- */
const light1 = new THREE.DirectionalLight(0xffffff, 1.1)
light1.position.set(100, 600, -800)
scene.add(light1)
// const light2 = new THREE.DirectionalLight(0x002288)
// light2.position.set(-1, -1, -1)
// scene.add(light2)
const light3 = new THREE.AmbientLight(0x222222)
scene.add(light3)

/* -------------------------------------------------------------------------- */
/*                                STATS DAT GUI                               */
/* -------------------------------------------------------------------------- */
// const stats = new Stats()
// document.body.appendChild(stats.dom)

const params = {
  algorithm: ASTAR
}

const gui = new dat.GUI({
  height: 5 * 32 - 1
})

gui.add(params, 'algorithm', {
  Greedy: GREEDY,
  UCS: UCS,
  'A*': ASTAR
})

/* -------------------------------------------------------------------------- */
/*                          VERTEX SHADER REFERENCES                          */
/* -------------------------------------------------------------------------- */
const shaderTime = { value: 0 }

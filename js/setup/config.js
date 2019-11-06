/* -------------------------------------------------------------------------- */
/*                                   BASICS                                   */
/* -------------------------------------------------------------------------- */
const CAMERA_FAR = 2400
const FOG_FAR = 3000

/* -------------------------------------------------------------------------- */
/*                                    GAME                                    */
/* -------------------------------------------------------------------------- */
const DIVISIONS = 16 // blocks per side of map
const DIMENSION = 50 // pixels per block

const MONSTER_TAG = 'MONSTER-TAG'
const MONSTER_SPEED = 10
const MONSTER_RADIUS = 20
const MONSTER_DIM = 30
const MONSTER_MIN_RECALC_DELAY = 200
const MONSTER_MAX_RECALC_DELAY = 400
const MONSTER_EYE_DIST = 15
const MONSTER_SPAWN_DELAY = 1000

const PLAYER_TAG = 'PLAYER-TAG'
const PLAYER_ACCELERATION = 20
const PLAYER_INERTIA = 5.5
const PLAYER_LERP_FACTOR = 0.9
const PLAYER_OBSTACLE_DELAY = 500
const PLAYER_RADIUS = 16
const PLAYER_DIM = 12

const TREASURE_TAG = 'TREASURE-TAG'

const OBSTACLE_LIFESPAN = 1000
const OBSTACLE_HEIGHT = 10
const OBSTACLE_OPACITY = 1

const SIMPLEX_SCALE = 4 * Math.random()
const NOISE_RANGE = 0.08

const EPSILON = 1 / 1024

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */
const BACKGROUND_COLOR = '#222831'

const WORLD_PLATFORM_COLOR = '#978A7B'
const WORLD_WALL_COLOR = '#5A4B39'

const MONSTER_COLOR = '#537ec5'
const MONSTER_RAY_ARROW_COLOR = '#c61234'

const PLAYER_COLOR = '#ff8080'
const PLAYER_RAY_ARROW_COLOR = '#c6f1d6'

const PATH_COLOR = '#f1fa3c'
const OBSTACLE_COLOR = '#B49256'

/* -------------------------------------------------------------------------- */
/*                                   OTHERS                                   */
/* -------------------------------------------------------------------------- */
const ASTAR = 'ASTAR'
const UCS = 'UCS'
const GREEDY = 'GREEDY'
const ALGORITHM = UCS

const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3

const MOVE_UP = 0
const MOVE_RIGHT = 1
const MOVE_DOWN = 2
const MOVE_LEFT = 3

const LEFT_CLICK = 0
const RIGHT_CLICK = 2

/* -------------------------------------------------------------------------- */
/*                                   BASICS                                   */
/* -------------------------------------------------------------------------- */
const CAMERA_FAR = 2400
const FOG_FAR = 3000

/* -------------------------------------------------------------------------- */
/*                                    GAME                                    */
/* -------------------------------------------------------------------------- */
const DIVISIONS = 20 // blocks per side of map
const DIMENSION = 40 // pixels per block

const MONSTER_TAG = 'MONSTER-TAG'
const MONSTER_RECALC_DELAY = 200
const MONSTER_SPEED = 10

const PLAYER_TAG = 'PLAYER-TAG'
const PLAYER_ACCELERATION = 20
const PLAYER_INERTIA = 5
const PLAYER_LERP_FACTOR = 0.9
const PLAYER_OBSTACLE_DELAY = 500

const PLAYER_DIM = 35
const MONSTER_DIM = 30

const OBSTACLE_LIFESPAN = 1000
const OBSTACLE_HEIGHT = 10
const OBSTACLE_OPACITY = 1

const SIMPLEX_SCALE = 4
const NOISE_RANGE = 0.08

const EPSILON = 1 / 1024

/* -------------------------------------------------------------------------- */
/*                                   COLORS                                   */
/* -------------------------------------------------------------------------- */
const BACKGROUND_COLOR = '#222831'

const WORLD_PLATFORM_COLOR = '#903749'
const WORLD_WALL_COLOR = '#53354a'

const MONSTER_COLOR = '#e84545'
const TARGET_COLOR = '#537ec5'
const PATH_COLOR = '#f1fa3c'
const OBSTACLE_COLOR = '#003f5c'

const MOVE_UP = 0
const MOVE_RIGHT = 1
const MOVE_DOWN = 2
const MOVE_LEFT = 3

const LEFT_CLICK = 0
const RIGHT_CLICK = 2

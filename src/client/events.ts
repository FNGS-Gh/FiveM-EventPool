// Change this one if you wish to use custom prefixes
export enum Prefix {
  MOVEMENT  = 'Movement:',
  WATER     = 'Water:',
  AIR       = 'Air:',
  VEHICLE   = 'Vehicle:',
}

// Movement
export enum BaseMoveEvent {
  STILL     = `${Prefix.MOVEMENT}Still`,
  WALKING   = `${Prefix.MOVEMENT}Walking`,
  RUNNING   = `${Prefix.MOVEMENT}Running`,
  SPRINTING = `${Prefix.MOVEMENT}Sprinting`,
}

export enum MoveEvent {
  MOVING    = `${Prefix.MOVEMENT}Moving`,
  STEALTH   = `${Prefix.MOVEMENT}Stealth`,
  RAGDOLL   = `${Prefix.MOVEMENT}Ragdoll`,
  ON_STAIRS = `${Prefix.MOVEMENT}OnStairs`,
}

export enum WaterEvent {
  IN_WATER    = `${Prefix.WATER}InWater`,
  UNDERWATER  = `${Prefix.WATER}Underwater`,
  DIVING      = `${Prefix.WATER}Diving`,
  DROWNING    = `${Prefix.WATER}Drowning`,
}

export enum AirEvent {
  IN_AIR    = `${Prefix.AIR}InAir`,
  JUMPING   = `${Prefix.AIR}Jumping`,
  FALLING   = `${Prefix.AIR}Falling`,
  CLIMBING  = `${Prefix.AIR}Climbing`,
}

// Vehicle
export enum BaseVehicleEvent {
  IN_VEHICLE  = `${Prefix.VEHICLE}InVehicle`,
  ENTERING    = `${Prefix.VEHICLE}Entering`,
  EXITING     = `${Prefix.VEHICLE}Exiting`,
}

export enum VehicleEvent {
  USE_VEHICLE = `${Prefix.VEHICLE}UseVehicle`,
  MOVING      = `${Prefix.VEHICLE}Moving`,
  DRIVER      = `${Prefix.VEHICLE}Driver`,
  IN_AIR      = `${Prefix.VEHICLE}InAir`,
  ON_ROOF     = `${Prefix.VEHICLE}OnRoof`,
  OFFROAD     = `${Prefix.VEHICLE}Offroad`,
  CRASHED     = `${Prefix.VEHICLE}Crashed`,
}
import { Prefix, PlayerInfo } from './EventPool';

// Ground movement
enum BaseMoveEvent {
  STILL     = `${Prefix.MOVEMENT}Still`,
  WALKING   = `${Prefix.MOVEMENT}Walking`,
  RUNNING   = `${Prefix.MOVEMENT}Running`,
  SPRINTING = `${Prefix.MOVEMENT}Sprinting`,
}

enum MoveEvent {
  MOVING    = `${Prefix.MOVEMENT}Moving`,
  STEALTH   = `${Prefix.MOVEMENT}Stealth`,
  RAGDOLL   = `${Prefix.MOVEMENT}Ragdoll`,
  ON_STAIRS = `${Prefix.MOVEMENT}OnStairs`,
}

class PedMovement extends PlayerInfo {
  private _pos: number[]        = [0, 0, 0];
  private _state: BaseMoveEvent = BaseMoveEvent.STILL;

  public moving   = false;
  public stealth  = false;
  public ragdoll  = false;
  public onStairs = false;

  private get pos(): number[] {
    return this._pos;
  }

  private set pos(arr: number[]) {
    if (arr.length === 3) this._pos = arr;
    else this._pos = [0, 0, 0];
  }

  private get state(): BaseMoveEvent {
    return this._state;
  }

  private set state(state: BaseMoveEvent) {
    if (this._state !== state) {
      emit(this._state, false);
      emit(state, true);
      this._state = state;
    }
  }

  public get isStill(): boolean {
    return this._state === BaseMoveEvent.STILL;
  }

  public get isWalking(): boolean {
    return this._state === BaseMoveEvent.WALKING;
  }

  public get isRunning(): boolean {
    return this._state === BaseMoveEvent.RUNNING;
  }

  public get isSprinting(): boolean {
    return this._state === BaseMoveEvent.SPRINTING;
  }

  public loop() {
    const pos = GetEntityCoords(PlayerInfo.ped);
    if (this.moving === pos.every((val, idx) => val === this.pos[idx])) {
      this.moving != this.moving;
      emit(MoveEvent.MOVING, this.moving, pos);
    }
    this.pos = pos;

    if (GetPedStealthMovement(PlayerInfo.ped) !== this.stealth)
      this.toggleField('stealth', MoveEvent.STEALTH);

    if (IsPedRagdoll(PlayerInfo.ped) !== this.ragdoll)
      this.toggleField('ragdoll', MoveEvent.RAGDOLL);

    if (GetPedConfigFlag(PlayerInfo.ped, 253, true) !== this.onStairs)
      this.toggleField('onStairs', MoveEvent.ON_STAIRS);

    if (IsPedStill(PlayerInfo.ped))           this.state = BaseMoveEvent.STILL;
    else if (IsPedWalking(PlayerInfo.ped))    this.state = BaseMoveEvent.WALKING;
    else if (IsPedRunning(PlayerInfo.ped))    this.state = BaseMoveEvent.RUNNING;
    else if (IsPedSprinting(PlayerInfo.ped))  this.state = BaseMoveEvent.SPRINTING;
  }
}

// Water movement
enum WaterEvent {
  IN_WATER    = `${Prefix.WATER}InWater`,
  UNDERWATER  = `${Prefix.WATER}Underwater`,
  DIVING      = `${Prefix.WATER}Diving`,
  DROWNING    = `${Prefix.WATER}Drowning`,
}

class PedWater extends PlayerInfo {
  public inWater    = false;
  public underwater = false;
  public diving     = false;
  public drowning   = false;

  public loop() {
    if (IsPedSwimming(PlayerInfo.ped) !== this.inWater)
      this.toggleField('inWater', WaterEvent.IN_WATER);

    if (IsPedSwimmingUnderWater(PlayerInfo.ped) !== this.underwater)
      this.toggleField('underwater', WaterEvent.UNDERWATER);

    if (IsPedDiving(PlayerInfo.ped) !== this.diving)
      this.toggleField('diving', WaterEvent.DIVING);

    if (GetPlayerUnderwaterTimeRemaining(PlayerInfo.id) <= 0 !== this.drowning)
      this.toggleField('drowning', WaterEvent.DROWNING);
  }
}

// Air movement
enum AirEvents {
  IN_AIR    = `${Prefix.AIR}InAir`,
  JUMPING   = `${Prefix.AIR}Jumping`,
  FALLING   = `${Prefix.AIR}Falling`,
  CLIMBING  = `${Prefix.AIR}Climbing`,
}

class PedAir extends PlayerInfo {
  public inAir    = false;
  public jumping  = false;
  public falling  = false;
  public climbing = false;

  public loop() {
    if (IsEntityInAir(PlayerInfo.ped) !== this.inAir)
      this.toggleField('inAir', AirEvents.IN_AIR);

    if (IsPedJumping(PlayerInfo.ped) !== this.jumping)
      this.toggleField('jumping', AirEvents.JUMPING);

    if (IsPedFalling(PlayerInfo.ped) !== this.falling)
      this.toggleField('falling', AirEvents.FALLING);

    if (IsPedClimbing(PlayerInfo.ped) !== this.climbing)
      this.toggleField('climbing', AirEvents.CLIMBING);
  }
}

export const Movement = new PedMovement;
export const Water = new PedWater;
export const Air = new PedAir;
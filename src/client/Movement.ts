import { PlayerInfo } from './main';
import { BaseMoveEvent, MoveEvent, WaterEvent, AirEvent } from './events';

// Ground movement
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
    const ped = PlayerInfo.ped;
    const pos = GetEntityCoords(ped);

    if (this.moving !== !pos.every((val, idx) => val === this.pos[idx]))
      this.sendEvent('moving', MoveEvent.MOVING);

    this.pos = pos;

    if (GetPedStealthMovement(ped) !== this.stealth)
      this.sendEvent('stealth', MoveEvent.STEALTH);

    if (IsPedRagdoll(ped) !== this.ragdoll)
      this.sendEvent('ragdoll', MoveEvent.RAGDOLL);

    if (GetPedConfigFlag(ped, 253, true) !== this.onStairs)
      this.sendEvent('onStairs', MoveEvent.ON_STAIRS);

    if (IsPedStill(ped))           this.state = BaseMoveEvent.STILL;
    else if (IsPedWalking(ped))    this.state = BaseMoveEvent.WALKING;
    else if (IsPedRunning(ped))    this.state = BaseMoveEvent.RUNNING;
    else if (IsPedSprinting(ped))  this.state = BaseMoveEvent.SPRINTING;
  }
}

// Water movement
class PedWater extends PlayerInfo {
  public inWater    = false;
  public underwater = false;
  public diving     = false;
  public drowning   = false;

  public loop() {
    const ped = PlayerInfo.ped;

    if (IsPedSwimming(ped) !== this.inWater)
      this.sendEvent('inWater', WaterEvent.IN_WATER);

    if (IsPedSwimmingUnderWater(ped) !== this.underwater)
      this.sendEvent('underwater', WaterEvent.UNDERWATER);

    if (IsPedDiving(ped) !== this.diving)
      this.sendEvent('diving', WaterEvent.DIVING);

    if (GetPlayerUnderwaterTimeRemaining(PlayerInfo.id) <= 0 !== this.drowning)
      this.sendEvent('drowning', WaterEvent.DROWNING);
  }
}

// Air movement
class PedAir extends PlayerInfo {
  public inAir    = false;
  public jumping  = false;
  public falling  = false;
  public climbing = false;

  public loop() {
    const ped = PlayerInfo.ped;

    if (IsEntityInAir(ped) !== this.inAir)
      this.sendEvent('inAir', AirEvent.IN_AIR);

    if (IsPedFalling(ped) !== this.falling)
      this.sendEvent('falling', AirEvent.FALLING);

    if (IsPedClimbing(ped) !== this.climbing)
      this.sendEvent('climbing', AirEvent.CLIMBING);
  }

  public tickLoop() {
    const ped = PlayerInfo.ped;

    if (IsPedJumping(ped) !== this.jumping)
      this.sendEvent('jumping', AirEvent.JUMPING);
  }
}

export const Movement = new PedMovement;
export const Water = new PedWater;
export const Air = new PedAir;
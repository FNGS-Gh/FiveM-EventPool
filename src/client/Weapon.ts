import { PlayerInfo } from './main';
import { BaseWeaponEvent, WeaponEvent } from './events';

class WeaponHandler extends PlayerInfo {
  private _state: BaseWeaponEvent = BaseWeaponEvent.USE_FIREARM;

  public weaponHash = GetHashKey('WEAPON_UNARMED');

  public useWeapon = false;
  public aiming = false;
  public rolling = false;
  public shooting = false;
  public switching = false;

  public get state(): BaseWeaponEvent {
    return this._state;
  }

  public set state(state: BaseWeaponEvent) {
    if (this._state !== state) {
      emit(this._state, false, this.weaponHash);
      emit(state, true, this.weaponHash);
      this._state = state;
    }
  }

  public get isMelee(): boolean {
    return this.useWeapon && (this._state === BaseWeaponEvent.USE_MELEE);
  }

  public get isThrow(): boolean {
    return this.useWeapon && (this._state === BaseWeaponEvent.USE_THROW);
  }

  public get isFirearm(): boolean {
    return this.useWeapon && (this._state === BaseWeaponEvent.USE_FIREARM );
  }

  private checkRoll(ped: number) {
    let isRolling = false;

    if (GetFollowPedCamViewMode() === 4) {
      isRolling = IsEntityPlayingAnim(ped, 'move_strafe@roll_fps', 'combatroll_fwd_p1_00', 3)
        || IsEntityPlayingAnim(ped, 'move_strafe@roll_fps', 'combatroll_fwd_p2_00', 3);
    } else {
      isRolling = IsEntityPlayingAnim(ped, 'move_strafe@roll', 'combatroll_fwd_p1_00', 3)
        || IsEntityPlayingAnim(ped, 'move_strafe@roll', 'combatroll_fwd_p2_00', 3);
    }

    if (this.rolling !== isRolling)
      this.sendEvent('rolling', WeaponEvent.ROLLING, this.weaponHash);
  }

  public loop() {
    const ped = PlayerInfo.ped;

    const weaponHash = GetCurrentPedWeapon(ped);

    if (this.weaponHash !== weaponHash)
      this.weaponHash = weaponHash;

    const armedMelee = IsPedArmed(ped, 1);
    const armedThrow = IsPedArmed(ped, 2);
    const armedFirearm = IsPedArmed(ped, 4);
    const armedAny = armedMelee || armedThrow || armedFirearm;

    if (armedMelee)         this.state = BaseWeaponEvent.USE_MELEE;
    else if (armedThrow)    this.state = BaseWeaponEvent.USE_THROW;
    else                    this.state = BaseWeaponEvent.USE_FIREARM;

    if (this.useWeapon !== armedAny)
      this.sendEvent('useWeapon', WeaponEvent.USE_WEAPON, this.weaponHash);

    if (this.aiming !== IsPlayerFreeAiming(PlayerInfo.id))
      this.sendEvent('aiming', WeaponEvent.AIMING, this.weaponHash);

    if (this.switching !== IsPedSwappingWeapon(ped))
      this.sendEvent('switching', WeaponEvent.SWITCHING);

    this.checkRoll(ped);
  }

  public tickLoop() {
    const ped = PlayerInfo.ped;

    if (this.shooting !== IsPedShooting(ped))
      this.sendEvent('shooting', WeaponEvent.SHOOTING, this.weaponHash);
  }
}

export const Weapon = new WeaponHandler;
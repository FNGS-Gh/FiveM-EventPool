import { PlayerInfo } from './main';
import { BaseVehicleEvent, VehicleEvent } from './events';
import { VehicleEntity } from './utils';

// Vehicle Events Handler
class VehicleHandler extends PlayerInfo {
  private _state: BaseVehicleEvent = BaseVehicleEvent.IN_VEHICLE;

  public vehEntity: VehicleEntity | null = null;

  public useVehicle = false;
  public moving     = false;
  public driver     = false;
  public inAir      = false;
  public onRoof     = false;
  public crashed    = false;

  private get state() {
    return this._state;
  }

  private set state(state: BaseVehicleEvent) {
    if (this._state !== state) {
      if (this.vehEntity !== null)
        emit(this._state, false, this.vehEntity.id);

      emit(state, true, this.vehEntity?.id);
      this._state = state;
    }
  }

  public get isInVehicle(): boolean {
    return this.useVehicle && (this._state === BaseVehicleEvent.IN_VEHICLE);
  }

  public get isEntering(): boolean {
    return this.useVehicle && (this._state === BaseVehicleEvent.ENTERING);
  }

  public get isExiting(): boolean {
    return this.useVehicle && (this._state === BaseVehicleEvent.EXITING);
  }

  private getVehEntity(entity: number): VehicleEntity {
    const vehEntity: VehicleEntity = {
      id: entity,
      pos: [0, 0, 0]
    };

    const pos = GetEntityCoords(entity);
    if (pos.length === 3) vehEntity.pos = pos;

    return vehEntity;
  }

  private reset() {
    this.useVehicle = false;
    this.moving     = false;
    this.driver     = false;
    this.inAir      = false;
    this.onRoof     = false;
    this.crashed    = false;

    emit(VehicleEvent.USE_VEHICLE, false, this.vehEntity?.id);

    this.vehEntity = null;
  }
  
  private baseLoop(ped: number): boolean {
    const inEnter = IsPedInAnyVehicle(ped, true);
    const inFull = IsPedInAnyVehicle(ped, false);

    if (!inFull) {
      this.state = inEnter
        ? BaseVehicleEvent.ENTERING
        : BaseVehicleEvent.EXITING;
      return true;
    } else this.state = BaseVehicleEvent.IN_VEHICLE;

    return false;
  }

  public loop() {
    const ped = PlayerInfo.ped;
    const vehicle = GetVehiclePedIsUsing(ped);
    const useVehicle = vehicle !== 0;

    if (!useVehicle && this.vehEntity !== null) {
      this.reset();
      return;
    }

    if (this.vehEntity?.id !== vehicle)
      this.vehEntity = this.getVehEntity(vehicle);

    if (!this.useVehicle)
      this.sendEvent('useVehicle', VehicleEvent.USE_VEHICLE, this.vehEntity.id);

    const pos = GetEntityCoords(this.vehEntity.id);

    if (this.moving !== !pos.every((val, idx) => val === this.vehEntity?.pos[idx]))
      this.sendEvent('moving', VehicleEvent.MOVING, this.vehEntity.id);

    this.vehEntity.pos = pos;

    if (this.baseLoop(ped)) return;
  }
}
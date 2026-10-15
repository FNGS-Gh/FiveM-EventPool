import { PlayerInfo } from './main';
import { BaseVehicleEvent, VehicleEvent } from './events';
import { OFFROAD_TERRAINS, VehicleEntity } from './utils';

// Vehicle Events Handler
class VehicleHandler extends PlayerInfo {
  private _state: BaseVehicleEvent = BaseVehicleEvent.IN_VEHICLE;

  public vehEntity: VehicleEntity | null = null;

  public useVehicle = false;
  public moving     = false;
  public driver     = false;
  public inAir      = false;
  public onRoof     = false;
  public offroad    = false;

  private get state() {
    return this._state;
  }

  private set state(state: BaseVehicleEvent) {
    if (this._state !== state) {
      if (this.vehEntity)
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
    this.offroad    = false;

    emit(VehicleEvent.USE_VEHICLE, false, this.vehEntity?.id);

    this.vehEntity = null;
  }

  private checkOffroad(vehicle: number) {
    const driveType = GetVehicleDrivetrainType(GetEntityModel(vehicle));
    
    const isOffroad = driveType === 2
      ? OFFROAD_TERRAINS.includes(GetVehicleWheelSurfaceMaterial(vehicle, 4))
      || OFFROAD_TERRAINS.includes(GetVehicleWheelSurfaceMaterial(vehicle, 5))
      : OFFROAD_TERRAINS.includes(GetVehicleWheelSurfaceMaterial(vehicle, 0))
      || OFFROAD_TERRAINS.includes(GetVehicleWheelSurfaceMaterial(vehicle, 1));

    if (this.offroad !== isOffroad)
      this.sendEvent('offroad', VehicleEvent.OFFROAD, vehicle);
  }
  
  private baseLoop(ped: number) {
    const inEnter = IsPedInAnyVehicle(ped, true);
    const inFull = IsPedInAnyVehicle(ped, false);

    if (!inFull) this.state = inEnter
      ? BaseVehicleEvent.ENTERING
      : BaseVehicleEvent.EXITING;
    else this.state = BaseVehicleEvent.IN_VEHICLE;
  }

  public loop() {
    const ped = PlayerInfo.ped;
    const vehicle = GetVehiclePedIsUsing(ped);
    const useVehicle = vehicle !== 0;

    if (!useVehicle && this.vehEntity) {
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

    const driverPed = GetPedInVehicleSeat(this.vehEntity.id, -1)
      || GetLastPedInVehicleSeat(this.vehEntity.id, -1);
    const isDriver = driverPed !== 0 && driverPed === ped;
    
    if (this.driver !== isDriver)
      this.sendEvent('driver', VehicleEvent.DRIVER, this.vehEntity.id);

    if (this.inAir !== IsEntityInAir(this.vehEntity.id))
      this.sendEvent('inAir', VehicleEvent.IN_AIR, this.vehEntity.id);

    if (this.onRoof !== IsVehicleStuckOnRoof(this.vehEntity.id))
      this.sendEvent('onRoof', VehicleEvent.ON_ROOF, this.vehEntity.id);

    this.checkOffroad(this.vehEntity.id);
    this.baseLoop(ped);
  }

  public tickLoop() {
    if (!this.vehEntity) return;

    if (HasEntityCollidedWithAnything(this.vehEntity.id))
      emit(VehicleEvent.CRASHED, this.vehEntity.id);
  }
}

export const Vehicle = new VehicleHandler;
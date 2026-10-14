import { PlayerInfo } from './main';
import { VehicleEvent } from './utils';

// Vehicle Events Handler
class VehicleHandler extends PlayerInfo {
  public vehEntity: number | null = null;

  public useVehicle = false;
  public inVehicle  = false;
  public entering   = false;
  public exiting    = false;
  public moving     = false;
  public driver     = false;
  public inAir      = false;
  public onRoof     = false;
  public crashed    = false;

  private reset() {
    this.vehEntity = null;

    this.useVehicle = false;
    this.inVehicle  = false;
    this.entering   = false;
    this.exiting    = false;
    this.moving     = false;
    this.driver     = false;
    this.inAir      = false;
    this.onRoof     = false;
    this.crashed    = false;

    emit(VehicleEvent.USE_VEHICLE, false);
  }

  public loop() {
    const ped = PlayerInfo.ped;
    const vehicle = GetVehiclePedIsUsing(ped);
    const useVehicle = vehicle !== 0;

    if (!useVehicle) {
      this.reset();
      return;
    }

    this.vehEntity = vehicle;

    if (useVehicle !== this.useVehicle)
      this.toggleField('useVehicle', VehicleEvent.USE_VEHICLE);

    const inEnter = IsPedInAnyVehicle(ped, true);
    const inFull = IsPedInAnyVehicle(ped, false);

    if (inFull !== this.inVehicle)
      this.toggleField('inVehicle', VehicleEvent.IN_VEHICLE);

    const isEntering = inEnter && !inFull;
    if (isEntering !== this.entering)
      this.toggleField('entering', VehicleEvent.ENTERING);

    const isExiting = !inEnter && !inFull
    if (isExiting !== this.exiting)
      this.toggleField('exiting', VehicleEvent.EXITING);

    if (isEntering || isExiting) return;
  }
}
import { Movement, Water, Air } from './Movement';
import { Vehicle } from './Vehicle';
import { Weapon } from './Weapon';

// Main parent class to store player Ped and ID values
export class PlayerInfo {
  private static _ped = -1;
  private static _id  = -1;

  protected static get id(): number {
    return PlayerInfo._id;
  }

  public static get ped(): number {
    return PlayerInfo._ped;
  }

  public static set ped(ped: number) {
    PlayerInfo._ped = IsEntityAPed(ped) ? ped : PlayerPedId();
  }

  public static update() {
    if (PlayerInfo._ped === -1) PlayerInfo._ped = PlayerPedId();
    if (PlayerInfo._id === -1) PlayerInfo._id = PlayerId();
  }
  
  protected sendEvent(key: keyof this, eventName: string, ...args: any[]) {
    if (typeof this[key] === 'boolean') {
      (this as any)[key] = !this[key];
      emit(eventName, this[key], ...args);
    }
  }
}

let updInterval: NodeJS.Timeout | null = null;
let tickThread = false;

on('playerLoaded', () => {
  PlayerInfo.update();
  if (!updInterval) updInterval = setInterval(() => {
    Movement.loop();
    Water.loop();
    Air.loop();

    Vehicle.loop();

    Weapon.loop();
  }, 100);

  if (!tickThread) {
    setTick(() => {
      Vehicle.tickLoop();
      Weapon.tickLoop();
    });

    tickThread = true;
  }
});

on('PedChanged', (ped: number) => { // Edit 'PedChanged' to whatever client event handles player's ped change
  PlayerInfo.ped = ped;
});

globalThis.exports('IsPlayerMoving', (): boolean => Movement.moving);
globalThis.exports('IsPlayerOnStairs', (): boolean => Movement.onStairs);
globalThis.exports('IsPlayerDrowning', (): boolean => Water.drowning);

globalThis.exports('IsVehicleMoving', (): boolean => Vehicle.moving);
globalThis.exports('IsPlayerDriver', (): boolean => Vehicle.driver);
globalThis.exports('IsVehicleOffroad', (): boolean => Vehicle.offroad);

globalThis.exports('IsPlayerRolling', (): boolean => Weapon.rolling);
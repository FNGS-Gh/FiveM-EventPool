// Change this one if you wish to use custom prefixes
export enum Prefix {
  MOVEMENT  = 'Movement:',
  WATER     = 'Water:',
}

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
  
  protected toggleField(key: keyof this, eventName: string) {
    if (typeof this[key] === 'boolean') {
      this[key] != this[key];
      emit(eventName, this[key]);
    }
  }
}

on('playerLoaded', () => {
  PlayerInfo.update();
});

on('PedChanged', (ped: number) => { // Edit 'PedChanged' to whatever client event handles player's ped change
  PlayerInfo.ped = ped;
});
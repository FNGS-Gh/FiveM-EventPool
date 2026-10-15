export const OFFROAD_TERRAINS: number[] = [
  47,
  43,
  51,
  9,
  32,
  35,
  46,
  48,
  18,
  11,
  21,
  19,
  31,
] as const;

export interface VehicleEntity {
  id: number;
  pos: number[];
}
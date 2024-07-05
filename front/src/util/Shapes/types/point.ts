export type Vector2D = {
  x: number;
  y: number;
};

export type Vector3D = {
  x: number;
  y: number;
  z: number;
};

export type Point = Vector2D;

export const isPoint = (obj: unknown): obj is Point => {
  if (obj && typeof (obj as Point).x === 'number' && typeof (obj as Point).y === 'number') return true;
  return false;
};

export const isVector3D = (obj: unknown): obj is Vector3D => {
  if (
    obj &&
    typeof (obj as Vector3D).x === 'number' &&
    typeof (obj as Vector3D).y === 'number' &&
    typeof (obj as Vector3D).z === 'number'
  )
    return true;
  return false;
};

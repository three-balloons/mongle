import { Vector3D } from './point';

export type PenConfig = {
  color: Color;
  thickness: number;
  alpha: number;
  font: 'serif';
  fontSize: number;
  fontWeight: 'normal' | 'bold' | number;
};

export type Color =
  | 'black'
  | 'silver'
  | 'gray'
  | 'white'
  | 'maroon'
  | 'red'
  | 'purple'
  | 'fuchsia'
  | 'green'
  | 'lime'
  | 'olive'
  | 'yellow'
  | 'navy'
  | 'blue'
  | 'teal'
  | 'aqua'
  | 'orange'
  | 'pink'
  | Vector3D;

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const isRect = (obj: unknown): obj is Rect => {
  if (
    obj &&
    typeof (obj as Rect).left === 'number' &&
    typeof (obj as Rect).top === 'number' &&
    typeof (obj as Rect).width === 'number' &&
    typeof (obj as Rect).height === 'number'
  )
    return true;
  return false;
};

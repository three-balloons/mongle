import { BUBBLE_BORDER_WIDTH } from '@/util/constant';
import { isCollisionPointWithRect } from '@/util/shapes/collision';

export type ResizeMode =
    | 'topside'
    | 'leftside'
    | 'rightside'
    | 'bottomside'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'inside';

export const getTouchRegion = (rect: Rect, position: Vector2D): ResizeMode | 'outside' | 'inside' => {
    if (
        isCollisionPointWithRect(position, {
            top: rect.top - BUBBLE_BORDER_WIDTH,
            left: rect.left - BUBBLE_BORDER_WIDTH,
            width: rect.width + BUBBLE_BORDER_WIDTH * 2,
            height: rect.height + BUBBLE_BORDER_WIDTH * 2,
        })
    ) {
        if (
            isCollisionPointWithRect(position, {
                top: rect.top - BUBBLE_BORDER_WIDTH,
                left: rect.left - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'topLeft';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top - BUBBLE_BORDER_WIDTH,
                left: rect.left + rect.width - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'topRight';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top + rect.height - BUBBLE_BORDER_WIDTH,
                left: rect.left - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'bottomLeft';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top + rect.height - BUBBLE_BORDER_WIDTH,
                left: rect.left + rect.width - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'bottomRight';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top - BUBBLE_BORDER_WIDTH,
                left: rect.left + BUBBLE_BORDER_WIDTH,
                width: rect.width - BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'topside';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top + BUBBLE_BORDER_WIDTH,
                left: rect.left - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: rect.height - BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'leftside';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top + BUBBLE_BORDER_WIDTH,
                left: rect.left + rect.width - BUBBLE_BORDER_WIDTH,
                width: BUBBLE_BORDER_WIDTH * 2,
                height: rect.height - BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'rightside';
        else if (
            isCollisionPointWithRect(position, {
                top: rect.top + rect.height - BUBBLE_BORDER_WIDTH,
                left: rect.left + BUBBLE_BORDER_WIDTH,
                width: rect.width - BUBBLE_BORDER_WIDTH * 2,
                height: BUBBLE_BORDER_WIDTH * 2,
            })
        )
            return 'bottomside';
        else return 'inside';
    }
    return 'outside';
};

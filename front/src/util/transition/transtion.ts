type Entity<K extends string, V> = Record<K, V>;

export const easeInOutCubic = <K extends string>(
    t: number,
    start: Entity<K, number>,
    end: Entity<K, number>,
): Entity<K, number> => {
    const result: Partial<Entity<K, number>> = {};
    for (const key in start) {
        if (start.hasOwnProperty.call(start, key) && end.hasOwnProperty.call(end, key)) {
            const startValue = start[key];
            const endValue = end[key];
            const easedValue =
                t < 0.5
                    ? (endValue - startValue) * (4 * t * t * t) + startValue
                    : (endValue - startValue) * (1 - Math.pow(-2 * t + 2, 3) / 2) + startValue;
            result[key] = easedValue;
        }
    }
    return result as Entity<K, number>;
};

export const easeInCubic = <K extends string>(
    t: number,
    start: Entity<K, number>,
    end: Entity<K, number>,
): Entity<K, number> => {
    const result: Partial<Entity<K, number>> = {};
    for (const key in start) {
        if (start.hasOwnProperty.call(start, key) && end.hasOwnProperty.call(end, key)) {
            const startValue = start[key];
            const endValue = end[key];
            const easedValue = (endValue - startValue) * (t * t * t) + startValue;
            result[key] = easedValue;
        }
    }
    return result as Entity<K, number>;
};

export const easeOutCubic = <K extends string>(
    t: number,
    start: Entity<K, number>,
    end: Entity<K, number>,
): Entity<K, number> => {
    const result: Partial<Entity<K, number>> = {};
    for (const key in start) {
        if (start.hasOwnProperty.call(start, key) && end.hasOwnProperty.call(end, key)) {
            const startValue = start[key];
            const endValue = end[key];
            const easedValue = (endValue - startValue) * (1 - Math.pow(1 - t, 3)) + startValue;
            result[key] = easedValue;
        }
    }
    return result as Entity<K, number>;
};

export const linear = <K extends string>(
    t: number,
    start: Entity<K, number>,
    end: Entity<K, number>,
): Entity<K, number> => {
    const result: Partial<Entity<K, number>> = {};
    for (const key in start) {
        if (start.hasOwnProperty.call(start, key) && end.hasOwnProperty.call(end, key)) {
            const startValue = start[key];
            const endValue = end[key];
            const easedValue = (endValue - startValue) * t + startValue;
            result[key] = easedValue;
        }
    }
    return result as Entity<K, number>;
};

/**
 * serialize class name
 */
export const cn = (...classNames: (string | boolean | null | undefined)[]) => {
    const mergedClassName = classNames.filter((className) => !!className).join(' ');
    if (mergedClassName === '') return undefined;
    return mergedClassName;
};

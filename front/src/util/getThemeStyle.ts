import themeStyle from '@/style/common/theme.module.css';

export const getThemeStyle = (theme: Theme = '하늘'): string => {
    if (theme == '하늘') return themeStyle.themeBlue;
    if (theme == '분홍') return themeStyle.themePink;
    if (theme == '연두') return themeStyle.themeGreen;
    if (theme == '노랑') return themeStyle.themeYellow;
    if (theme == '하양') return themeStyle.themeWhite;
    if (theme == '검정') return themeStyle.themeBlack;
    return themeStyle.themeBlue;
};

export const getThemeMainColor = (theme: Theme = '하늘', alpha: number = 1.0): string => {
    if (theme == '하늘') return `rgba(175, 245, 255, ${alpha})`;
    if (theme == '분홍') return `rgba(255, 206, 206, ${alpha})`;
    if (theme == '연두') return `rgba(186, 237, 208, ${alpha})`;
    if (theme == '노랑') return `rgba(255, 254, 177, ${alpha})`;
    if (theme == '하양') return `rgba(204, 204, 204, ${alpha})`;
    if (theme == '검정') return `rgba(46, 46, 46, ${alpha})`;
    return `rgba(68, 231, 255, ${alpha})`;
};

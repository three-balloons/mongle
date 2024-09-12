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

/**
 * 테마의 50% 색상을 가져옴
 */
export const getThemeMainColor = (theme: Theme = '하늘', alpha: number = 1.0): string => {
    if (theme == '하늘') return `rgba(68, 231, 255, ${alpha})`;
    if (theme == '분홍') return `rgba(245, 185, 167, ${alpha})`;
    if (theme == '연두') return `rgba(151, 193, 169, ${alpha})`;
    if (theme == '노랑') return `rgba(227, 225, 87, ${alpha})`;
    if (theme == '하양') return `rgba(240, 240, 240, ${alpha})`;
    if (theme == '검정') return `rgba(26, 26, 26, ${alpha})`;
    return `rgba(175, 245, 255, ${alpha})`;
};

/**
 * 테마의 25% 색상을 가져옴
 */
export const getThemeSecondColor = (theme: Theme = '하늘', alpha: number = 1.0): string => {
    if (theme == '하늘') return `rgba(197, 248, 255, ${alpha})`;
    if (theme == '분홍') return `rgba(255, 234, 234, ${alpha})`;
    if (theme == '연두') return `rgba(207, 242, 224, ${alpha})`;
    if (theme == '노랑') return `rgba(247, 247, 188, ${alpha})`;
    if (theme == '하양') return `rgba(189, 189, 189, ${alpha})`;
    if (theme == '검정') return `rgba(64, 64, 64, ${alpha})`;
    return `rgba(197, 248, 255, ${alpha})`;
};

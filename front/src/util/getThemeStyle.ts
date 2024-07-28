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

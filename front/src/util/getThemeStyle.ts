import themeStyle from '@/style/common/theme.module.css';

export const getThemeStyle = (theme: Theme = '푸른하늘'): string => {
    if (theme == '해질녘') return themeStyle.themePink;
    if (theme == '로즈마리') return themeStyle.themeGreen;
    return themeStyle.themeBlue;
};

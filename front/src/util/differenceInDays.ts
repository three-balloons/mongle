export const differenceInDays = (date: Date) => {
    const today = new Date();
    const differenceInMilliseconds = today.getTime() - date.getTime();
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
};

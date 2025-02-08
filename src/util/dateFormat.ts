import dayjs from 'dayjs';

export const differenceInDaysformat = (date: Date) => {
    const today = dayjs();
    const differenceInMilliseconds = today.diff(dayjs(date), 'days');
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
};

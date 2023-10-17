import dayjs from "dayjs";

export const displayDate = ( date: string ) => {
    return dayjs(date).format("DD/MM/YYYY");
}
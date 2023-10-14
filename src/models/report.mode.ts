import { Dayjs } from "dayjs";

export interface IRecordD {
    date: string,
    psu_code: string,
    withdrawal_amount: string | number,
    note: string
  }
  
export interface IRecordN {
    date: string,
    psu_code: string,
    code: string,
    name: string,
    withdrawal_amount: string | number,
    note: string
}
  
export interface IFacOpt {
    label: string;
    id: string;
}
  
export type mode = "N" | "D"
  
export interface IFormInput {
    startDate: Dayjs | null,
    endDate: Dayjs | null,
    fac: string,
    begin: boolean,
    mode: mode
}
  
export interface ITableRecD {
    code: string,
    name: string,
    total_amount: string | number,
    records: IRecordD[]
}
  
export interface ITableRecN {
    plan: string,
    product: string,
    type: string,
    total_amount: string | number
    records: IRecordN[]
}
  
export interface Props {
    options: IFacOpt[]
}
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
  
export type mode = "N" | "D" | "A" | "B"

type status = "N" | "D" | "S"
  
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

export interface IRecordA {
    code: string,
    date: string,
    psu_code: string,
    name: string,
    fac: string,
    product: string,
    withdrawal_amount: string,
    plan: string,
    type: string,
    status: status
}
  
export interface IRecordB {
    code: string,
    name: string,
    fac: string,
    product: string,
    total_amount: string
    balance: string,
    plan: string,
    type: string,
    status: status
}

export interface Props {
    options: IFacOpt[]
}
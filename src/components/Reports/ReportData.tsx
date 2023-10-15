import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { ITableRecD, ITableRecN, mode } from "@/models/report.mode";
import dayjs from "dayjs";
import { displayNumber } from "../../../util/displayNumber";

interface ReportDataProps {
    mode: mode;
    data: any[];
}

const ReportData = ( { mode, data }: ReportDataProps ) => {
    if ( mode === "N" ){
        return (
            <Box>
            <Typography variant='h3'>รายการเบิกจ่าย</Typography>
            { !!data && data.map( ( fac:any, index:number ) => {
            const facName = Object.keys(fac)[0];
      
            return (
                <Box key={index}>
                <Typography variant='h5'>{facName}</Typography>
                { fac[facName].map( ( item:ITableRecN, index:number ) => {
                    const { plan, product, type, records } = item;
                    let { total_amount } = item;
                    let sum = 0;
                    total_amount = Number(total_amount)
                    let totalAmountDisplay = displayNumber(total_amount);
                    return (
                    <Box key={index}>
                        <Typography variant="h6">{plan}</Typography>
                        <Typography variant="h6">{product}</Typography>
                        <Typography variant="h6">{type} เงินที่ได้รับ {totalAmountDisplay} บาท</Typography>
                        <Table sx={{ border: '1px solid #000', marginTop:"10px", marginBottom:"20px"}} >
                        <TableHead>
                            <TableRow>
                            <TableCell sx={{ border: '1px solid #000'}}>วันที่เบิกจ่าย</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>เลขที่ มอ.</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>itemcode</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>ชื่อรายการ</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>จำนวนเงินที่เบิกจ่าย</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>ยอดเงินคงเหลือ</TableCell>
                            <TableCell sx={{ border: '1px solid #000'}}>หมายเหตุ</TableCell>
                            </TableRow>
                        </TableHead>
                            <TableBody key={index}>
                            { records.map( (record, index:number) => {
                                const { code, name, date, psu_code, note } = record;
                                let { withdrawal_amount } = record;
                                withdrawal_amount = +withdrawal_amount
                                total_amount = +total_amount - +withdrawal_amount
                                sum += +withdrawal_amount
                                return (
                                        <TableRow key={index}>
                                            <TableCell sx={{ border: '1px solid #000' }}>{dayjs(date).format("DD/MM/YYYY")}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{psu_code}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{code}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{name}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(withdrawal_amount)}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(total_amount)}</TableCell>
                                            <TableCell sx={{ border: '1px solid #000' }}>{note}</TableCell>
                                        </TableRow>
                                )})}
                                <TableRow>
                                <TableCell sx={{ border: '1px solid #000' }} colSpan={4}>ยอดเงินคงเหลือ</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(sum)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(total_amount)} บาท</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                    )
                } ) }
                </Box>
            )
            })
            }
        </Box>
        )
    } else if ( mode === "D" ){
        return (
            <Box>
            <Typography variant='h3'>รายการเงินกัน</Typography>
                { !!data && data.map( ( fac:any, index:number ) => {
                const facName = Object.keys(fac)[0];
                return (
                    <Box key={index}>
                    <Typography variant='h5'>{facName}</Typography>
                    { fac[facName].map( (item:ITableRecD, index:number) => {
                        const { code, name, records, total_amount } = item;
                        let balance = +total_amount;
                        let sum = 0;
                        return (
                        <Box key={index}>
                            <Typography variant="h6">{code}</Typography>
                            <Typography variant="h6">{name}</Typography>
                            <Typography variant="h6">เงินที่ได้รับ {displayNumber(balance)} บาท</Typography>
                            <Table sx={{ border: '1px solid #000', marginTop:"10px", marginBottom:"20px"}} >
                            <TableHead>
                                <TableRow>
                                <TableCell sx={{ border: '1px solid #000'}}>วันที่เบิกจ่าย</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>เลขที่ มอ.</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>จำนวนเงินที่เบิกจ่าย</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>ยอดเงินคงเหลือ</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>หมายเหตุ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            { records.map(  ( record, index:number )  => {
                                const { date, psu_code, note } = record;
                                let { withdrawal_amount } = record
                                withdrawal_amount = +withdrawal_amount
                                balance -= +withdrawal_amount
                                sum += +withdrawal_amount
                                return (
                                <TableRow key={index}>
                                    <TableCell sx={{ border: '1px solid #000'}}>{date}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000'}}>{psu_code}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000'}}>{displayNumber(withdrawal_amount)}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000'}}>{displayNumber(balance)}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000'}}>{note}</TableCell>
                                </TableRow>
                                )})}
                                <TableRow>
                                    <TableCell sx={{ border: '1px solid #000' }} colSpan={2}>ยอดเงินคงเหลือ</TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(sum)}</TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>{displayNumber(balance)} บาท</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </Box>
                        )})}
                    </Box> )})}
            </Box>
        )
    }
}

export default ReportData;
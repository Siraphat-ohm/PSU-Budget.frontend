import React from "react";
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import { IRecordA, ITableRecD, ITableRecN, mode } from "@/models/report.mode";
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
                                    <TableCell sx={{ border: '1px solid #000', width:"120px" }}>วันที่เบิกจ่าย</TableCell>
                                    <TableCell sx={{ border: '1px solid #000', width:"170px" }}>เลขที่ มอ.</TableCell>
                                    <TableCell sx={{ border: '1px solid #000', width:"140px" }}>Itemcode</TableCell>
                                    <TableCell sx={{ border: '1px solid #000' }}>ชื่อรายการ</TableCell>
                                    <TableCell sx={{ border: '1px solid #000', width:"150px" }}>จำนวนเงินที่เบิกจ่าย</TableCell>
                                    <TableCell sx={{ border: '1px solid #000', width:"130px" }}>ยอดเงินคงเหลือ</TableCell>
                                    <TableCell sx={{ border: '1px solid #000', width:"260px" }}>หมายเหตุ</TableCell>
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
                                                <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(withdrawal_amount)}</TableCell>
                                                <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(total_amount)}</TableCell>
                                                <TableCell sx={{ border: '1px solid #000' }}>{note}</TableCell>
                                            </TableRow>
                                    )})}
                                    <TableRow>
                                    <TableCell sx={{ border: '1px solid #000' }} colSpan={4}>ยอดเงินคงเหลือ</TableCell>
                                    <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(sum)}</TableCell>
                                    <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(total_amount)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    )})}
                    </Box>
                )})}
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
                                <Typography variant="h6">itemcode: {code}</Typography>
                                <Typography variant="h6">ชื่อรายการ: {name}</Typography>
                                <Typography variant="h6">เงินที่ได้รับ {displayNumber(balance)} บาท</Typography>
                                <Table sx={{ border: '1px solid #000', marginTop:"10px", marginBottom:"20px"}} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ border: '1px solid #000', width:"120px" }}>วันที่เบิกจ่าย</TableCell>
                                        <TableCell sx={{ border: '1px solid #000', width:"170px" }}>เลขที่ มอ.</TableCell>
                                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>จำนวนเงินที่เบิกจ่าย</TableCell>
                                        <TableCell sx={{ border: '1px solid #000', width:"130px" }}>ยอดเงินคงเหลือ</TableCell>
                                        <TableCell sx={{ border: '1px solid #000' }}>หมายเหตุ</TableCell>
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
                                        <TableCell sx={{ border: '1px solid #000'}}>{dayjs(date).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000'}}>{psu_code}</TableCell>
                                        <TableCell align="right" sx={{ border: '1px solid #000'}}>{displayNumber(withdrawal_amount)}</TableCell>
                                        <TableCell align="right" sx={{ border: '1px solid #000'}}>{displayNumber(balance)}</TableCell>
                                        <TableCell sx={{ border: '1px solid #000'}}>{note}</TableCell>
                                    </TableRow>
                                    )})}
                                    <TableRow>
                                        <TableCell sx={{ border: '1px solid #000' }} colSpan={2}>ยอดเงินคงเหลือ</TableCell>
                                        <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(sum)}</TableCell>
                                        <TableCell align="right" sx={{ border: '1px solid #000' }}>{displayNumber(balance)}</TableCell>
                                    </TableRow>
                                </TableBody>
                                </Table>
                            </Box>
                            )})}
                        </Box> )})}
            </Box>
        )
    } else if ( mode === "A" ){
        return (
            <Box>
                <Typography variant='h3'>รายงานรวม</Typography>
                <Table sx={{ border: '1px solid #000', marginTop:"10px", marginBottom:"20px"}} >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ border: '1px solid #000', width:"110px" }}>วันที่เบิกจ่าย</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>เลขที่ มอ.</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"155px" }}>itemcode</TableCell>
                        <TableCell sx={{ border: '1px solid #000'}}>ชื่อรายการ</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"180px" }}>คณะ</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>แผน</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>ผลผลิต/โครงการ</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>ประเภท</TableCell>
                        <TableCell sx={{ border: '1px solid #000', width:"150px" }}>จำนวนเงินที่เบิกจ่าย</TableCell>
                        <TableCell align="center" sx={{ border: '1px solid #000' }}>status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { !!data && data.map( ( item: IRecordA, index:number )  => {
                        const { code, date, fac, name, product, psu_code, status, withdrawal_amount, plan, type } = item;
                        return ( 
                            <TableRow key={index}>
                                <TableCell sx={{ border: '1px solid #000'}}>{dayjs(date).format("DD/MM/YYYY")}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{psu_code}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{code}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{name}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{fac}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{plan}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{product}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{type}</TableCell>
                                <TableCell align="right" sx={{ border: '1px solid #000'}}>{displayNumber(+withdrawal_amount)}</TableCell>
                                <TableCell sx={{ border: '1px solid #000'}}>{status}</TableCell>
                            </TableRow>
                        ) 
                    }) }
                </TableBody>
                </Table>
            </Box>

        )

    }
}

export default ReportData;
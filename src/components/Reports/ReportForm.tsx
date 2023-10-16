import { IFacOpt, mode } from "@/models/report.mode";
import { Autocomplete, Box, Checkbox, FormControlLabel, IconButton, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface ReportFormProps {
    handleSubmit: any; 
    control: any; 
    errors: any; 
    onSubmit: any
    begin: boolean;
    setBegin: React.Dispatch<React.SetStateAction<boolean>>;
    mode: mode;
    setMode: React.Dispatch<React.SetStateAction<mode>>;
    createExcel: () => void;
    options: IFacOpt[];
    setData: React.Dispatch<React.SetStateAction<any>>;
  }

const ReportForm = ( { handleSubmit, control, errors, begin, setBegin, setMode, createExcel, options, onSubmit, setData }: ReportFormProps ) => {
        return (
            <Box>
                <form onSubmit={handleSubmit(handleSubmit(onSubmit))}>
                    <Box display="flex">
                    <Controller 
                        name='startDate'
                        control={control}
                        render={({ field }) => <DatePicker
                                                label='วันที่เริ่มต้น'
                                                format='DD/MM/YYYY'
                                                value={field.value}
                                                onChange={(date) => field.onChange(date) }
                                                disabled={begin}
                                                />
                        }
                    />
                    <p style={ { borderBottom: "1.5px solid rgb(80, 80, 78)", width: "30px", margin:"auto 10px auto 10px" } }></p>
                    <Controller 
                        name='endDate'
                        control={control}
                        render={({ field }) => <DatePicker
                                                label='วันที่สุดท้าย'
                                                format='DD/MM/YYYY'
                                                value={field.value}
                                                onChange={(date) => field.onChange(date) }
                                                disabled={begin}
                                                />
                        }
                    />
                    <Controller
                        name='fac'
                        control={control} 
                        rules={{ required: 'กรุณาเลือกคณะ' }}
                        render={({ field }) => {
                        const { onChange } = field;
                        return (
                                <Box sx={{ marginLeft: "10px"}} width={320}>
                                <Autocomplete
                                    onChange={(event: any, newValue) => onChange(newValue ? newValue.id : null) }
                                    options={ options }
                                    renderInput={ (params) => <TextField 
                                                                {...params} 
                                                                label= "เลือกคณะ" 
                                                                error={!!errors.fac}
                                                                helperText={errors.fac?.message}
                                                            /> 
                                }
                                />
                                </Box>
                            )}}
                    />
                    <IconButton type='submit' sx={{ marginLeft: "10px" }}>
                        <SearchIcon/>
                    </IconButton>
                    <IconButton sx={{ marginLeft: "10px" }} onClick={createExcel}>
                        <FileDownloadIcon/>
                    </IconButton>
                    </Box>
                    <Box marginTop="10px" display="flex">
                    <Controller
                        name='begin'
                        control={control}
                        render={({field}) => {
                        const { name, value, onChange } = field
                        return (
                            <FormControlLabel
                            sx={{ marginLeft:"2px"}}
                            control={
                                <Checkbox 
                                name={name}
                                value={value}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    onChange(e.target.checked);
                                    setBegin(e.target.checked);
                                }}
                            />
                            } 
                            label="ตั้งแต่เริ่มต้น"
                            />
                        )
                        }}
                    />
                    <Controller
                        control={control}
                        name='mode'
                        render={ ({field}) => {
                        const { name, value, onChange } = field
                        return (
                        <RadioGroup row defaultValue="N" 
                            value={value}
                            name={name}
                            onChange={ (e) => {
                                onChange(e.target.value);
                                setMode( ( e.target.value ) as mode );
                                setData(null);
                            }}
                        >
                            <FormControlLabel value="N" control={<Radio />} label="เงินประจำปี" />
                            <FormControlLabel value="D" control={<Radio />} label="เงินกัน" />
                            <FormControlLabel value="A" control={<Radio />} label="รายงานรวม" />
                        </RadioGroup>
                        )
                        }}
                    />
                    </Box>
                </form>
            </Box>
        )
}

export default ReportForm;
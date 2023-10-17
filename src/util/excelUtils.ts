import { IRecordA, IRecordB, ITableRecD, ITableRecN, mode } from "@/models/report.mode";
import exceljs from "exceljs"
import saveAs from "file-saver";
import toast from "react-hot-toast";
import { displayDate } from "./displayDay";

export const excelUtils = async( mode: mode, data:any[]) => {
    try {
      let wb = new exceljs.Workbook();
      let ws = wb.addWorksheet("report");
      if ( mode === "N" ){
        ws.columns = [ 
          { width: 10 }, 
          { width: 17 }, 
          { width: 17 }, 
          { width: 50 }, 
          { width: 20, style: { numFmt: "#,###.00" } }, 
          { width: 15, style: { numFmt: "#,###.00" } }, 
          { width: 25 }, 
        ]
        ws.addRow( [ 'รายงานเงินประจำปี' ])
        ws.getCell('A1').style = { font: { size: 20, bold: true } };
        let start = 7;
        data?.forEach( ( fac:any, index:number ) => {
          const facName = Object.keys(fac)[0];
          fac[facName].forEach( ( item: ITableRecN, j:number ) => {
            const { plan, product, type, records, total_amount } = item;
            let balance = +total_amount;
            const length = records.length;
            let sum = 0;
            ws.addRow( [ facName ] );
            ws.addRow( [ plan ] );
            ws.addRow( [ product ] );
            ws.addRow( [ type ] );
            ws.addRow( [ 'เงินที่ได้รับ', balance, 'บาท' ]  );
            const rows = records.map( item => { 
              const { code, date, name, note, psu_code, withdrawal_amount } = item;
              balance -= +withdrawal_amount 
              sum += +withdrawal_amount
              return [ displayDate(date), psu_code, code, name, +withdrawal_amount, balance, note ]
            });
            ws.addTable({
              name: `รายงานเงินประจำปี-${index}-${j}`,
              ref: `A${start}`,
              headerRow: true,
              style: {
                theme: 'TableStyleMedium18',
                showRowStripes: true,
              },
              columns: [
                { name: 'วันที่เบิกจ่าย' },
                { name: 'เลขที่ มอ.'},
                { name: 'itemcode' },
                { name: 'ชื่อรายการ' },
                { name: 'จำนวนเงินที่เบิกจ่าย' },
                { name: 'คงเหลือ',  },
                { name: 'หมายเหตุ',  }
              ],
              rows: [ ...rows, [ 'ยอดเงินคงเหลือ', '', '', '', sum, balance ]],
            });
            ws.getCell(`B${start-1}`).style = { numFmt: "#,###.00" }
            start += length + 8;
            ws.addRow( [] );
            });
        } );
      } else if ( mode  === "D" ){
        ws.addRow( [ 'รายงานเงินกัน' ])
        ws.getCell('A1').style = { font: { size: 20, bold: true } };
        let start = 6 
        ws.columns = [ 
          { width: 10 }, 
          { width: 18 }, 
          { width: 13, style: { numFmt: "#,###.00"} }, 
          { width: 20, style: { numFmt: "#,###.00"} }, 
          { width: 25 }, 
        ]
        data?.forEach( ( fac:any, index:number ) => {
          const facName = Object.keys(fac)[0];
          fac[facName].forEach( ( item: ITableRecD, j:number ) => {
            const { code, name, total_amount, records } = item;
            let balance = +total_amount;
            let sum = 0;
            ws.addRow( [ facName ] );
            ws.addRow( [ code ] );
            ws.addRow( [ name ] );
            ws.addRow( [ 'เงินที่ได้รับ',  balance, 'บาท' ] );
            const rows = records.map( item => {
              const { date, note, psu_code, withdrawal_amount } = item;
              balance -= +withdrawal_amount;
              sum += +withdrawal_amount 
              return [ displayDate(date), psu_code, +withdrawal_amount, balance, note ]
            });
            const length = rows.length;
            ws.addTable({
              name: `รายงานเงินกัน-${index}-${j}`,
              ref: `A${start}`,
              headerRow: true,
              style: {
                theme: 'TableStyleMedium18',
                showRowStripes: true,
              },
              columns: [
                { name: 'วันที่เบิกจ่าย' },
                { name: 'เลขที่ มอ.'},
                { name: 'จำนวนเงินที่เบิกจ่าย' },
                { name: 'คงเหลือ',  },
                { name: 'หมายเหตุ',  }
              ],
              rows: [ ...rows, [ 'ยอดเงินคงเหลือ', '', sum, balance ]],
            });
            ws.getCell(`B${start-1}`).style = { numFmt: "#,###.00" }
            start += length + 7;
            ws.addRow( [] );
          })
        });
      } else if ( mode === "A" ){
        ws.columns = [
          { width: 10 },
          { width: 21 },
          { width: 16 },
          { width: 50 },
          { width: 20 },
          { width: 20 },
          { width: 30 },
          { width: 25 },
          { width: 20, style: { numFmt: "#,###.00"} },
          { width: 6 }
        ]
        ws.addRow( [ 'รายงานรวม' ] );
        ws.getCell('A1').style = { font: { size: 20, bold: true } };
        const rows = data?.map( ( item: IRecordA) => {
          const { code, date, fac, name, plan, product, psu_code, status, type, withdrawal_amount } = item;
          return [ displayDate(date), psu_code, code, name, fac, plan, product, type, +withdrawal_amount, status ];
        }) ;
        ws.addTable({
          name: `รายงานรวม`,
          ref: `A2`,
          headerRow: true,
          style: {
            theme: 'TableStyleMedium18',
            showRowStripes: true,
          },
          columns: [
            { name: 'วันที่เบิกจ่าย' },
            { name: 'เลขที่ มอ.'},
            { name: 'itemcode'},
            { name: 'ชื่อรายการ'},
            { name: 'คณะ'},
            { name: 'แผน'},
            { name: 'ผลผลิต/โครงการ'},
            { name: 'ประเภท'},
            { name: 'จำนวนเงินที่เบิกจ่าย' },
            { name: 'status',  }
          ],
          rows
        });
      } else if ( mode === "B" ){
          ws.columns = [
            { width: 16 },
            { width: 50 },
            { width: 20 },
            { width: 20 },
            { width: 30 },
            { width: 25 },
            { width: 20, style: { numFmt: "#,###.00"} },
            { width: 20, style: { numFmt: "#,###.00"} },
            { width: 6 }
          ]
          ws.addRow( [ 'รายงานเงินเหลือจ่าย' ] );
          ws.getCell('A1').style = { font: { size: 20, bold: true }}
          const rows = data?.map( ( item: IRecordB) => {
            const { code, fac, name, plan, product, total_amount, status, type, balance } = item;
            return [ code, name, fac, plan, product, type, +total_amount, +balance, status ];
          }) ;
          ws.addTable({
            name: `รายงานเงินเหลือจ่าย`,
            ref: `A2`,
            headerRow: true,
            style: {
              theme: 'TableStyleMedium18',
              showRowStripes: true,
            },
            columns: [
              { name: 'Itemcode'},
              { name: 'ชื่อรายการ'},
              { name: 'คณะ'},
              { name: 'แผน'},
              { name: 'ผลผลิต/โครงการ'},
              { name: 'ประเภท'},
              { name: 'จำนวนเงินที่ได้รับ' },
              { name: 'ยอดเงินคงเหลือ' },
              { name: 'status',  }
            ],
            rows
          });

      }

      if ( !!data ) {
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}), 'report.xlsx');
      } else {
        toast.error("ไม่พบข้อมูล")
      }
    } catch (error:any) {
        const errorMessage = error.response?.data?.error || 'ระบบเกิดข้อผิดพลาด';
        toast.error( errorMessage );
    }
}
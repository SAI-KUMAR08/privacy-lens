import XLSX from 'xlsx'; import {parse as parseCsv} from 'csv-parse/sync';
export function parseFile(file,maxRows){const ext=file.originalname.toLowerCase().split('.').pop();let rows=[];
 if(ext==='csv'){const text=file.buffer.toString('utf8');rows=parseCsv(text,{columns:true,skip_empty_lines:true, bom:true, relax_column_count:false, to: maxRows+1});}
 else if(ext==='xlsx'){const wb=XLSX.read(file.buffer,{type:'buffer',cellDates:false,sheetRows:maxRows+2});const ws=wb.Sheets[wb.SheetNames[0]];rows=XLSX.utils.sheet_to_json(ws,{defval:'',raw:false});}
 else if(ext==='txt'){const text=file.buffer.toString('utf8'); // Chat exports are parsed into aggregate-only rows; message content never leaves this function.
 const lines=text.split(/\r?\n/).filter(Boolean);if(lines.length>maxRows)throw Error(`Maximum ${maxRows} lines exceeded`);return {kind:'chat',rows:lines.map((line,i)=>({line_number:String(i+1),content:line.replace(/^.*? - /,'')}))};}
 else throw Error('Unsupported file extension');if(rows.length>maxRows)throw Error(`Maximum ${maxRows} rows exceeded`);return {kind:'tabular',rows};}

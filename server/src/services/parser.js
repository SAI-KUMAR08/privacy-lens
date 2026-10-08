import XLSX from 'xlsx';
import { parse as parseCsv } from 'csv-parse/sync';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

const textFormats = new Set(['txt', 'log', 'md', 'json', 'xml', 'html', 'htm', 'eml', 'yaml', 'yml', 'csv', 'tsv']);
const tabularFormats = new Set(['csv', 'tsv', 'xlsx', 'xls', 'ods']);

function chatRows(text, maxRows) {
  const lines = String(text).replace(/\0/g, '').split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) throw new Error('No readable text was found in this file.');
  if (lines.length > maxRows) throw new Error(`Maximum ${maxRows} lines exceeded`);
  return { kind: 'chat', rows: lines.map((line, i) => ({ line_number: String(i + 1), content: line })) };
}

function parseDelimited(text, delimiter) {
  return parseCsv(text, { columns: true, skip_empty_lines: true, bom: true, relax_column_count: false, ...(delimiter ? { delimiter } : {}) });
}

function parsePdf(file, maxRows) {
  const parser = new PDFParse({ data: file.buffer });
  return parser.getText().then(result => {
    if (!result.text?.trim()) throw new Error('This PDF has no selectable text. Scanned image PDFs need OCR and cannot be scanned yet.');
    return chatRows(result.text, maxRows);
  }).finally(() => parser.destroy());
}

function parseDocx(file, maxRows) {
  return mammoth.extractRawText({ buffer: file.buffer }).then(result => chatRows(result.value, maxRows));
}

function flattenJson(value) {
  if (Array.isArray(value) && value.length && value.every(item => item && typeof item === 'object' && !Array.isArray(item))) return value;
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of ['rows', 'records', 'items', 'data', 'results']) {
      if (Array.isArray(value[key]) && value[key].length && value[key].every(item => item && typeof item === 'object' && !Array.isArray(item))) return value[key];
    }
  }
  return null;
}

function stripMarkup(text) {
  return text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:lt|#60);/gi, '<')
    .replace(/&(?:gt|#62);/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

export function parseFile(file, maxRows) {
  const ext = file.originalname.toLowerCase().split('.').pop();
  if (ext === 'pdf') return parsePdf(file, maxRows);
  if (ext === 'docx') return parseDocx(file, maxRows);

  if (tabularFormats.has(ext)) {
    let rows;
    if (ext === 'csv' || ext === 'tsv') {
      rows = parseDelimited(file.buffer.toString('utf8'), ext === 'tsv' ? '\t' : undefined);
    } else {
      const wb = XLSX.read(file.buffer, { type: 'buffer', cellDates: false, sheetRows: maxRows + 2 });
      const ws = wb.Sheets[wb.SheetNames[0]];
      rows = ws ? XLSX.utils.sheet_to_json(ws, { defval: '', raw: false }) : [];
    }
    if (rows.length > maxRows) throw new Error(`Maximum ${maxRows} rows exceeded`);
    return { kind: 'tabular', rows };
  }

  if (textFormats.has(ext)) {
    const text = file.buffer.toString('utf8').replace(/^\uFEFF/, '');
    if (ext === 'json') {
      let value;
      try { value = JSON.parse(text); } catch { throw new Error('This JSON file is invalid or incomplete.'); }
      const rows = flattenJson(value);
      if (rows) {
        if (rows.length > maxRows) throw new Error(`Maximum ${maxRows} rows exceeded`);
        return { kind: 'tabular', rows };
      }
      return chatRows(JSON.stringify(value), maxRows);
    }
    return chatRows(['html', 'htm'].includes(ext) ? stripMarkup(text) : text, maxRows);
  }

  throw new Error('Unsupported file type. Supported: CSV, TSV, XLSX, XLS, ODS, PDF (text PDFs), DOCX, TXT, LOG, MD, JSON, XML, HTML, EML, YAML.');
}

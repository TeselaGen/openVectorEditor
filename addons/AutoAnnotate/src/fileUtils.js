/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import { parse } from "papaparse";

export const allowedCsvFileTypes = [".csv", ".txt", ".xlsx"];

export const isZipFile = (file) => {
  const type = file.mimetype || file.type;
  return type === "application/zip" || type === "application/x-zip-compressed";
};

export const getExt = (file) => file.name.split(".").pop();
export const isExcelFile = (file) => getExt(file) === "xlsx";
export const isCsvFile = (file) => getExt(file) === "csv";
export const isTextFile = (file) => ["text", "txt"].includes(getExt(file));

const defaultCsvParserOptions = {
  header: true,
  skipEmptyLines: "greedy",
  trimHeaders: true,
  // delimiter: ","
};

export const parseCsvFile = (csvFile, parserOptions = {}) => {
  return new Promise((resolve, reject) => {
    parse(csvFile.originFileObj, {
      ...defaultCsvParserOptions,
      complete: (results) => {
        if (results && results.errors && results.errors.length) {
          return reject("Error in csv: " + JSON.stringify(results.errors));
        }
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
      ...parserOptions
    });
  });
};

export const parseCsvString = (csvString, parserOptions = {}) => {
  return parse(csvString, { ...defaultCsvParserOptions, ...parserOptions });
};

export const cleanCommaSeparatedCell = (cellData) =>
  (cellData || "")
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n);

/**
 * Because the csv rows might not have the same header keys in some cases (extended properties)
 * this function will make sure that each row will have all headers so that the export
 * does not drop fields
 * @param {*} rows
 */
export const cleanCsvExport = (rows) => {
  const allHeaders = [];
  rows.forEach((row) => {
    Object.keys(row).forEach((header) => {
      if (!allHeaders.includes(header)) {
        allHeaders.push(header);
      }
    });
  });
  rows.forEach((row) => {
    allHeaders.forEach((header) => {
      row[header] = row[header] || "";
    });
  });
  return rows;
};

export const validateCSVRequiredHeaders = (
  fields,
  requiredHeaders,
  filename
) => {
  const missingRequiredHeaders = requiredHeaders.filter((field) => {
    return !fields.includes(field);
  });
  if (missingRequiredHeaders.length) {
    const name = filename ? `The file ${filename}` : "CSV file";
    return `${name} is missing required headers. (${missingRequiredHeaders.join(
      ", "
    )})`;
  }
};

export const validateCSVRow = (row, requiredHeaders, index) => {
  const missingRequiredFields = requiredHeaders.filter((field) => !row[field]);
  if (missingRequiredFields.length) {
    if (missingRequiredFields.length === 1) {
      return `Row ${index + 1} is missing the required field "${
        missingRequiredFields[0]
      }"`;
    } else {
      return `Row ${
        index + 1
      } is missing these required fields: ${missingRequiredFields.join(", ")}`;
    }
  }
};

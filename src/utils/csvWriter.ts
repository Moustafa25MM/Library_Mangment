import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

interface CsvHeader {
  id: string;
  title: string;
}

export const writeDataToCsvFile = async <T extends Record<string, any>>(
  relativeFilePath: string,
  headers: CsvHeader[],
  records: T[]
): Promise<void> => {
  const absoluteFilePath = path.join(__dirname, '../../src', relativeFilePath);
  console.log(__dirname);
  const csvWriter = createObjectCsvWriter({
    path: absoluteFilePath,
    header: headers.map((header) => ({ id: header.id, title: header.title })),
  });

  try {
    await csvWriter.writeRecords(records);
    console.log('CSV file written successfully to', absoluteFilePath);
  } catch (error) {
    console.error('Error writing CSV file:', error);
    throw error;
  }
};

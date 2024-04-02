import fs from 'fs';
import csv from 'csv-parser'

const BINARY_INDEX = 2;
const NUM_OF_BITS = 8;

const parseIpInfoFromCsv = async (fileAddress) => {
    let ipData = [];
    try {
        await new Promise((resolve, rejects) => {
            fs.createReadStream(fileAddress)
                .pipe(csv({ headers: false }))
                .on('data', (row) => {
                    ipData.push(row);
                })
                .on('end', () => {
                    console.log(`File: ${fileAddress} successfully processed!`);
                    resolve(ipData);
                })
                .on('error', (error) => {
                    console.error(error);
                    rejects(error);
                });
        })
    } catch (error) {
        console.error(`Can't read file: ${fileAddress}`, error);
        throw error;
    }
    return ipData;
}

const parseIpAddressToDecimal = (ipAddress) => {
    const ipOctets = ipAddress.split('.');
    let ipBytes = '';
    for (let i = 0; i < ipOctets.length; i++) {
        ipBytes += parseInt(ipOctets[[i]]).toString(BINARY_INDEX).padStart(NUM_OF_BITS, '0');
    }
    return parseInt(ipBytes, BINARY_INDEX);
}

const decimalToIpAddress = (decimalIp) => {
    const octet1 = (decimalIp >> 24) & 255;
    const octet2 = (decimalIp >> 16) & 255;
    const octet3 = (decimalIp >> 8) & 255;
    const octet4 = decimalIp & 255;
    return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

export { parseIpInfoFromCsv, parseIpAddressToDecimal, decimalToIpAddress };

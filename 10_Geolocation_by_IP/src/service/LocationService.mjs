import { parseIpAddressToDecimal, parseIpInfoFromCsv, decimalToIpAddress } from '../utils/CsvIpParser.mjs';

const DATABASE_FILE = '10_Geolocation_by_IP/data/IP2LOCATION-LITE-DB1.CSV';
const FROM_IP_INDEX = 0;
const TO_IP_INDEX = 1;
const COUNTRY_INDEX = 3;

let ipData = null;

const findLocationByIp = async (ipAddress) => { 
    if (!validateIpAddress(ipAddress)) {
        return `Invalid IP address: ${ipAddress}`;
    }
    
    
    ipData ??= await parseIpInfoFromCsv(DATABASE_FILE); 
    const digitIpAddress = parseIpAddressToDecimal(ipAddress);

    const filteredIpData = ipData.filter((row) => {
        return parseInt(row[FROM_IP_INDEX]) <= digitIpAddress 
            && parseInt(row[TO_IP_INDEX])>= digitIpAddress;
    });

    if (filteredIpData.length > 0) {
        const country = filteredIpData[0][COUNTRY_INDEX];
        const fromIp = decimalToIpAddress(filteredIpData[0][FROM_IP_INDEX]);
        const toIp = decimalToIpAddress(filteredIpData[0][TO_IP_INDEX]);
        const addressRange = `${fromIp} - ${toIp}`;
        return `${country} - ${ipAddress}, Address Range: ${addressRange}`;
    } else {
        return `Can't find country by IP: ${ipAddress}`;
    }
}

const validateIpAddress = (ipAddress) => {
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipRegex.test(ipAddress);
};

export { findLocationByIp };

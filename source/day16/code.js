import {
    getLines
} from '../modules/input.js';

const lines = getLines('day16');

function part1() {
    const packet = hex2bin(lines[0]);
    const decodedPacket = decodePacket(packet);

    let sum = 0;
    const queue = [decodedPacket];
    while (queue.length > 0) {
        const p = queue.shift();
        sum += Number(p.version);
        p.packets.forEach(cp => {
            queue.push(cp);
        });
    }
    return sum;
}
console.log(part1());

function part2() {
    const packet = hex2bin(lines[0]);
    const decodedPacket = decodePacket(packet);
    return getValue(decodedPacket);
}
console.log(part2());

function decodePacket(packet) {
    const decodedPacket = {
        version: '',
        typeId: '',
        literalValue: null,
        packets: [],
        length: 0
    };
    const version = bin2Number(packet.substring(0, 3));
    const typeId = bin2Number(packet.substring(3, 6));
    if (typeId === 4) {
        const groupRepresentation = packet.substring(6, packet.length);
        let binaryNumber = '';
        for (let i = 0; i < groupRepresentation.length; i += 5) {
            const group = groupRepresentation.substring(i, i + 5);
            binaryNumber += group.substring(1, 5);
            decodedPacket.length += 5;
            if (group[0] === '0') {
                break;
            }
        }
        const literalValue = bin2Number(binaryNumber);
        decodedPacket.literalValue = literalValue;
    } else {
        const lengthTypeId = packet.substring(6, 7);
        decodedPacket.length += 1;
        let binPackets = '';
        if (lengthTypeId === '0') {
            let totalLength = bin2Number(packet.substring(7, 7 + 15));
            binPackets = packet.substring(7 + 15, packet.length);
            decodedPacket.length += 15;
            while (totalLength > 0) {
                const packet2 = decodePacket(binPackets);
                const length = getLength(packet2);
                decodedPacket.packets.push(packet2);
                totalLength -= length;
                binPackets = binPackets.slice(length);
            }
        } else {
            const numberOfPackets = bin2Number(packet.substring(7, 7 + 11));
            binPackets = packet.substring(7 + 11, packet.length);
            decodedPacket.length += 11;
            for (let i = 0; i < numberOfPackets; i++) {
                const packet2 = decodePacket(binPackets);
                decodedPacket.packets.push(packet2);
                binPackets = binPackets.slice(getLength(packet2));
            }
        }
    }
    decodedPacket.version = version;
    decodedPacket.typeId = typeId;
    decodedPacket.length += 6;
    return decodedPacket;
}

function getValue(packet) {
    switch (packet.typeId) {
        case 0:
            packet.value = 0;
            packet.packets.forEach(p => {
                packet.value += getValue(p);
            });
            break;
        case 1:
            packet.value = 1;
            packet.packets.forEach(p => {
                packet.value *= getValue(p);
            });
            break;
        case 2:
            packet.value = Number.MAX_SAFE_INTEGER;
            packet.packets.forEach(p => {
                const v = getValue(p);
                if (v < packet.value) {
                    packet.value = v;
                }
            });
            break;
        case 3:
            packet.value = 0;
            packet.packets.forEach(p => {
                const v = getValue(p);
                if (v > packet.value) {
                    packet.value = v;
                }
            });
            break;
        case 4:
            packet.value = packet.literalValue;
            break;
        case 5:
            packet.value = getValue(packet.packets[0]) > getValue(packet.packets[1]) ? 1 : 0;
            break;
        case 6:
            packet.value = getValue(packet.packets[0]) < getValue(packet.packets[1]) ? 1 : 0;
            break;
        case 7:
            packet.value = getValue(packet.packets[0]) === getValue(packet.packets[1]) ? 1 : 0;
            break;
        default:
            console.log('uuups');
    }
    return packet.value;
}

function getLength(packet) {
    let sum = 0;
    const queue = [packet];
    while (queue.length > 0) {
        const p = queue.shift();
        sum += Number(p.length);
        p.packets.forEach(cp => {
            queue.push(cp);
        });
    }
    return sum;
}

function hex2bin(hex) {
    return hex.split('').map(element =>  (parseInt(element, 16).toString(2)).padStart(4, '0')).reduce((a,b) => a + b);
}

function bin2Number(bin) {
    return parseInt(bin, 2);
}
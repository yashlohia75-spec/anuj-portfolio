const fs = require('fs');
const path = require('path');

function getJpegPngDim(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const full = fs.readFileSync(filePath);
  if (full[0] === 0x89 && full[1] === 0x50 && full[2] === 0x4E && full[3] === 0x47) {
    return { width: full.readUInt32BE(16), height: full.readUInt32BE(20) };
  }
  if (full[0] === 0xFF && full[1] === 0xD8) {
    let offset = 2;
    while (offset < full.length) {
      if (full[offset] !== 0xFF) break;
      const marker = full[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        return { width: full.readUInt16BE(offset + 7), height: full.readUInt16BE(offset + 5) };
      }
      offset += 2 + full.readUInt16BE(offset + 2);
    }
  }
  return null;
}

function getMp4Dim(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const fd = fs.openSync(filePath, 'r');
    const stat = fs.fstatSync(fd);
    const bufSize = Math.min(stat.size, 10000000);
    const buf = Buffer.alloc(bufSize);
    fs.readSync(fd, buf, 0, bufSize, 0);
    fs.closeSync(fd);

    let offset = 0;
    while (offset < buf.length - 8) {
      const size = buf.readUInt32BE(offset);
      const type = buf.toString('ascii', offset + 4, offset + 8);
      if (size === 0) break;
      if (type === 'moov' || type === 'trak' || type === 'mdia') {
        offset += 8;
        continue;
      }
      if (type === 'tkhd') {
        const version = buf[offset + 8];
        const widthOffset = offset + (version === 1 ? 92 : 84);
        const matrixOffset = offset + (version === 1 ? 48 : 40);
        if (widthOffset + 8 <= buf.length) {
          let width = buf.readUInt32BE(widthOffset) >> 16;
          let height = buf.readUInt32BE(widthOffset + 4) >> 16;
          const a = buf.readInt32BE(matrixOffset) >> 16;
          const b = buf.readInt32BE(matrixOffset + 4) >> 16;
          let rotation = 0;
          if (a === 0 && b === 1) rotation = 90;
          else if (a === 0 && b === -1) rotation = 270;
          let displayWidth = (rotation === 90 || rotation === 270) ? height : width;
          let displayHeight = (rotation === 90 || rotation === 270) ? width : height;
          if (displayWidth > 0 && displayHeight > 0) {
            return { width: displayWidth, height: displayHeight };
          }
        }
      }
      offset += size;
    }
  } catch (e) {}
  return null;
}

const mediaTs = fs.readFileSync('src/media.ts', 'utf-8');
const lines = mediaTs.split('\n');
const results = {};
const imgFolder = {
  'Shyamoli': 'shyamoli',
  'Trident Group': 'trident',
  'Standard Electricals': 'standard electricals',
  'Halonix': 'halonix',
  'Indo Farm': 'indofarm',
  'Havells': 'havells',
  'Humsafar': 'humsafar',
  'Su-Kam': 'sukam',
  'Bahra University': 'bahra',
  'Hospitality': 'hospitality',
};

lines.forEach(line => {
  const match = line.match(/(img|vid)\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/);
  if (match) {
    const type = match[1];
    const id = match[2];
    const project = match[3];
    const filename = match[4];

    let dim = null;
    if (type === 'img') {
      const p = path.join('public/media/IMAGES', imgFolder[project], filename);
      dim = getJpegPngDim(p);
    } else {
      const p = path.join('public/media/videos', imgFolder[project], filename);
      dim = getMp4Dim(p);
      if (!dim && id === 'sh-v5') dim = { width: 1080, height: 1350 };
    }

    if (dim) {
      let orientation = 'portrait';
      if (dim.width > dim.height) orientation = 'landscape';
      else if (dim.width === dim.height) orientation = 'square';
      results[id] = { width: dim.width, height: dim.height, orientation };
    } else {
      console.warn('Could not determine dim for', id, filename);
    }
  }
});

fs.writeFileSync('src/media-orientations.json', JSON.stringify(results, null, 2));
console.log('Successfully saved', Object.keys(results).length, 'media orientations.');

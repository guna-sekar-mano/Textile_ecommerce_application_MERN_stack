// import path from 'path'
// import fs from 'fs'
// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const Saveimage = async (image, folpath) => {
//   try {
//     const binaryData = image.buffer;
//     const timestamp = new Date().getTime();
//     const directoryPath = path.join(__dirname, '../../uploads', folpath);
    
//     if (!fs.existsSync(directoryPath)) {
//       fs.mkdirSync(directoryPath, { recursive: true });
//     }
    
//     const filename = `/${folpath}/${timestamp}_${image.originalname}`;
//     const tempFilePath = path.join(__dirname, '../../uploads', filename);
    
//     fs.writeFileSync(tempFilePath, binaryData);
//     return `uploads${filename}`;

//   } catch (err) {
//     console.error('Save image error:', err);
//     throw err;
//   }
// };

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sanitizePath = (pathString) => {
  return pathString
    .replace(/[<>:"|?*\\]/g, '_')
    .replace(/\s+/g, ' ') 
    .trim();
};

export const Saveimage = async (image, folpath) => {
  try {
    const binaryData = image.buffer;
    const timestamp = new Date().getTime();
    
    const sanitizedFolpath = sanitizePath(folpath);
    const directoryPath = path.join(__dirname, '../../uploads', sanitizedFolpath);
   
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
   
    const sanitizedOriginalName = sanitizePath(image.originalname);
    
    const tempFilePath = path.join(__dirname, '../../uploads', sanitizedFolpath, `${timestamp}_${sanitizedOriginalName}`);
   
    fs.writeFileSync(tempFilePath, binaryData);
    
    return `uploads/${sanitizedFolpath}/${timestamp}_${sanitizedOriginalName}`;
  } catch (err) {
    console.error('Save image error:', err);
    throw err;
  }
};
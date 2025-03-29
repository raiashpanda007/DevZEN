import fs from 'fs';
import path from 'path';

interface File {
    type: "file" | "dir";
    name: string;
}

export const fetchDir = (dir: string, baseDir: string): Promise<File[]> => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.join('/home/ashwin-rai/Projects/DevZen/apps/backend', baseDir, dir);
        console.log("Resolved path:", absolutePath);

        fs.readdir(absolutePath, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err); 
            } else {
                resolve(
                    files.map(file => ({
                        type: file.isDirectory() ? "dir" : "file",
                        name: file.name,
                        path: `${baseDir}/${file.name}`,
                    }))
                );
            }
        });
    });
};


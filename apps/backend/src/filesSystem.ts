import fs from 'fs';
import path from 'path';

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

export const fetchAllDirs = (dir: string): Promise<RemoteFile[]> => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.join('/home/ashwin-rai/Projects/DevZen/apps/backend', dir);
        console.log("Resolved path:", absolutePath);

        fs.readdir(absolutePath, { withFileTypes: true }, async (err, dirents) => {
            if (err) {
                reject(err);
                return;
            }

            let results: RemoteFile[] = [];
            const promises = dirents.map((dirent) => {
                const filePath = `${dir}/${dirent.name}`;
                if (dirent.isDirectory()) {
                    results.push({
                        type: "dir",
                        name: dirent.name,
                        path: filePath,
                    });
                    return fetchAllDirs(filePath).then((childResults) => {
                        results = results.concat(childResults);
                    });
                } else {
                    results.push({
                        type: "file",
                        name: dirent.name,
                        path: filePath,
                    });
                    return Promise.resolve();
                }
            });

            Promise.all(promises)
                .then(() => resolve(results))
                .catch(reject);
        });
    });
};

export const fetchFileContent = async (file: string) => {
    const absolutePath = path.join('/home/ashwin-rai/Projects/DevZen/apps/backend', file);
    return new Promise((resolve, reject) => {
        fs.readFile(absolutePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const Delete = async (key: string) => {};
export const createNewFile = async (key: string) => {};
export const createNewFolder = async (key: string) => {};
export const renameFile = async (key: string, newKey: string) => {};
export const renameFolder = async (key: string, newKey: string) => {};

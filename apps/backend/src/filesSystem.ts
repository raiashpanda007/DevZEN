import fs from 'fs';
import path from 'path';

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

const homeDir = '/home/ashwin-rai/Projects/DevZen/apps/backend';

export const fetchAllDirs = (dir: string): Promise<RemoteFile[]> => {
    return new Promise((resolve, reject) => {
        const absolutePath = path.join(homeDir, dir);
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
    
    
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                
                resolve(data);
            }
        });
    });
};

export const Delete = async (path: string) => {
    const aboslutePath = homeDir+path;
    return new Promise((resolve, reject) => {
        fs.rm(aboslutePath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};
export const createNewFile = async (path: string,name:string) => {
    console.log("Creating file at path:", path);
    console.log("File name:", name);
    const absolutePath = homeDir + path+'/'+name;
    return new Promise((resolve, reject) => {
        fs.writeFile(absolutePath, "", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });

};
export const createNewFolder = async (path: string,name:string) => {
    return new Promise((resolve,reject) =>{
        const aboslutePath = homeDir+path+'/'+name;
        fs.mkdir(aboslutePath, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
};
export const renameFile = async (key: string, newName: string) => {
    const absolutePath = homeDir + key;
    const newNamePath = path.join(path.dirname(absolutePath), newName);
    return new Promise((resolve, reject) => {
        fs.rename(key, newName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};
export const renameFolder = async (key: string, newName: string) => {
    const absolutePath = homeDir + key;
    const newAboslutePath = path.join(path.dirname(absolutePath), newName);
    return new Promise((resolve, reject) => {
        fs.rename(absolutePath, newAboslutePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};


export const CRUD_operations = {
    createNewFile,
    createNewFolder,
    renameFile,
    renameFolder,
    Delete,
}
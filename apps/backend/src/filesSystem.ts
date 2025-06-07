import fs from 'fs';
import  p from 'path';

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}
import { create_folder_file_s3,delete_folder_file_s3 } from './awsS3files';

const homeDir = '/home/ashwin-rai/Projects/DevZen/apps/backend';

export const fetchAllDirs = (dir: string): Promise<RemoteFile[]> => {
    return new Promise((resolve, reject) => {
        const absolutePath = p.join(homeDir, dir);
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
    const aboslutePath = homeDir + path;
    const cloudPath = p.posix.join('code', path.replace(/^\/?workspace\/?/, ''));

    await delete_folder_file_s3(cloudPath);
    return new Promise((resolve, reject) => {
        fs.rm(aboslutePath, { recursive: true, force: true }, (err) => {
            if (err) {
                reject(err);
                console.error("Error deleting file or folder:", err);
            } else {
                resolve(true);
            }
        });
    });
};
export const createNewFile = async (path: string, name: string) => {
    const cloudPath = p.posix.join('code', path.replace(/^\/?workspace\/?/, ''), name);
    await create_folder_file_s3(cloudPath);
    const absolutePath = homeDir + path + '/' + name;
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
export const createNewFolder = async (path: string, name: string) => {
    const cloudPath = p.posix.join('code', path.replace(/^\/?workspace\/?/, ''), name ,'/');
    await create_folder_file_s3(cloudPath);
    return new Promise((resolve, reject) => {

        const aboslutePath = homeDir + path + '/' + name;
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
    const newNamePath = absolutePath.slice(0, absolutePath.lastIndexOf('/')) + '/' + newName;
    console.log("Renaming file from:", absolutePath, "to:", newNamePath);
    return new Promise((resolve, reject) => {
        fs.rename(absolutePath, newNamePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const renameFolder = async (key: string, newName: string) => {
    const absolutePath = p.join(homeDir, key);
    const newNamePath = absolutePath.slice(0, absolutePath.lastIndexOf('/')) + '/' + newName;
    console.log("Renaming Folder from:", absolutePath, "to:", newNamePath);
    return new Promise((resolve, reject) => {
        fs.rename(absolutePath, newNamePath, (err) => {
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
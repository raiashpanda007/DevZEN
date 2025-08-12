import fs from 'fs';
import p from 'path';

export interface RemoteFile {
    type: "file" | "dir";
    name: string;
    path: string;
}

import AdmZip from "adm-zip"

// Base directory now points directly to the mounted workspace root
const homeDir = '/workspace';
const workspaceRoot = homeDir; // Project folders live directly under /workspace

const resolvePath = (input: string) => (
    input.startsWith('/workspace') ? input : p.join(homeDir, input)
);

export const fetchAllDirs = (dir: string): Promise<RemoteFile[]> => {
    return new Promise((resolve, reject) => {
        const absolutePath = resolvePath(dir);
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

export const fetchFileContent = async (file: string): Promise<string> => {
    const absolutePath = resolvePath(file);
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

export const Delete = async (path: string) => {
    const absolutePath = resolvePath(path);
    return new Promise((resolve, reject) => {
        fs.rm(absolutePath, { recursive: true, force: true }, (err) => {
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
    const absolutePath = resolvePath(p.join(path, name));
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
    const absolutePath = resolvePath(p.join(path, name));
    return new Promise((resolve, reject) => {
        fs.mkdir(absolutePath, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const renameFile = async (key: string, newName: string) => {
    const absolutePath = resolvePath(key);
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
    const absolutePath = resolvePath(key);
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

export const saveFileContent = async (path: string, content: string) => {
    const absolutePath = resolvePath(path);
    console.log("Absolute file path while ", absolutePath);
    return new Promise((resolve, reject) => {
        fs.writeFile(absolutePath, content, "utf8", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

export const CompressFolder = async () => {
    const workspaceDir = workspaceRoot;
    if (!fs.existsSync(workspaceDir)) {
        fs.mkdirSync(workspaceDir, { recursive: true });
    }
    try {
        const folders = fs.readdirSync(workspaceDir).filter((name) => {
            const completePath = p.join(workspaceDir, name);
            return fs.statSync(completePath).isDirectory();
        });
        if (folders.length !== 1) {
            console.error("Expecting one folder to compress");
            return;
        }
        const projectId = folders[0];
        if (!projectId) {
            console.error("Can't find the folder to compress");
            return;
        }
        const projectPath = p.join(workspaceDir, projectId);
        const zip = new AdmZip();
        const items = fs.readdirSync(projectPath);
        for (const item of items) {
            const fullPath = p.join(projectPath, item);
            const relativePath = item;
            if (fs.statSync(fullPath).isDirectory()) {
                zip.addLocalFolder(fullPath, relativePath);
            } else {
                zip.addLocalFile(fullPath, "", relativePath);
            }
        }
        const outputZipPath = p.join(projectPath, `${projectId}.zip`);
        zip.writeZip(outputZipPath);

        fs.readdirSync(projectPath).forEach(item => {
            if (item !== `${projectId}.zip`) {
                const fullPath = p.join(projectPath, item);
                fs.rmSync(fullPath, { recursive: true, force: true });
            }
        });
    } catch (error) {
        console.error("Error in compressing folder", error)
    }
}

export const CRUD_operations = {
    createNewFile,
    createNewFolder,
    renameFile,
    renameFolder,
    Delete,
}
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

export const UncompressFolder = async (projectPath: string) => {
    const projectId = p.basename(projectPath);
    const zipFileName = `${projectId}.zip`;
    const zipFilePath = p.join(projectPath, zipFileName);

    if (!fs.existsSync(zipFilePath)) {
        console.warn(`Zip file not found for project '${projectId}' at ${zipFilePath}`);
        return;
    }

    const cleanupTempDir = (tempDir: string) => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    };

    try {
        let currentZipPath = zipFilePath;

        while (fs.existsSync(currentZipPath)) {
            const zip = new AdmZip(currentZipPath);
            const tempExtractDir = p.join(projectPath, `.__extract_${Date.now()}`);
            cleanupTempDir(tempExtractDir);
            fs.mkdirSync(tempExtractDir, { recursive: true });

            zip.extractAllTo(tempExtractDir, true);
            fs.rmSync(currentZipPath, { recursive: true, force: true });

            const extractedItems = fs.readdirSync(tempExtractDir);

            if (extractedItems.length === 1 && extractedItems[0] === zipFileName) {
                // Nested zip (zip-of-zip) scenario – move the inner zip to the project path and continue the loop.
                const nestedZipSource = p.join(tempExtractDir, zipFileName);
                fs.renameSync(nestedZipSource, currentZipPath);
                cleanupTempDir(tempExtractDir);
                continue;
            }

            // Remove any stale files before moving the fresh contents in
            fs.readdirSync(projectPath).forEach((entry) => {
                if (entry !== zipFileName && !entry.startsWith(".__extract_")) {
                    fs.rmSync(p.join(projectPath, entry), { recursive: true, force: true });
                }
            });

            for (const item of extractedItems) {
                const source = p.join(tempExtractDir, item);
                const destination = p.join(projectPath, item);
                if (fs.existsSync(destination)) {
                    fs.rmSync(destination, { recursive: true, force: true });
                }
                fs.renameSync(source, destination);
            }

            cleanupTempDir(tempExtractDir);
            console.log("Decompressed successfully:", zipFilePath);
            break;
        }
    } catch (error) {
        console.error("Failed to decompress the folder:", error);
    }
};

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
            if (name.startsWith(".")) {
                return false;
            }
            const completePath = p.join(workspaceDir, name);
            try {
                return fs.statSync(completePath).isDirectory();
            } catch (err) {
                console.warn(`Skipping ${completePath} while compressing workspace`, err);
                return false;
            }
        });

        if (folders.length === 0) {
            console.warn("No project folders found to compress");
            return;
        }

        for (const projectId of folders) {
            const projectPath = p.join(workspaceDir, projectId);
            const zipFileName = `${projectId}.zip`;
            const outputZipPath = p.join(projectPath, zipFileName);

            const items = fs.readdirSync(projectPath).filter((item) => item !== zipFileName);

            if (items.length === 0) {
                console.warn(`Skipping compression for '${projectId}' – no files found to archive.`);
                continue;
            }

            const zip = new AdmZip();

            for (const item of items) {
                const fullPath = p.join(projectPath, item);

                let stats: fs.Stats;
                try {
                    stats = fs.statSync(fullPath);
                } catch (error) {
                    console.warn(`Skipping '${fullPath}' while creating archive`, error);
                    continue;
                }

                if (stats.isDirectory()) {
                    zip.addLocalFolder(fullPath, item);
                } else if (stats.isFile()) {
                    zip.addLocalFile(fullPath, "", item);
                }
            }

            if (zip.getEntries().length === 0) {
                console.warn(`Zip for project '${projectId}' would be empty, skipping.`);
                continue;
            }

            zip.writeZip(outputZipPath);

            fs.readdirSync(projectPath).forEach((item) => {
                if (item !== zipFileName) {
                    const fullPath = p.join(projectPath, item);
                    fs.rmSync(fullPath, { recursive: true, force: true });
                }
            });

            console.log(`Compressed workspace for project '${projectId}'`);
        }
    } catch (error) {
        console.error("Error in compressing folder", error);
    }
};



export const CRUD_operations = {
    createNewFile,
    createNewFolder,
    renameFile,
    renameFolder,
    Delete,
}
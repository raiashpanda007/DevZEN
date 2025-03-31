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
export const fetchFileContent = async (file:string) =>{
    const absolutePath = path.join('/home/ashwin-rai/Projects/DevZen/apps/backend', file);
    return new Promise((resolve,reject) =>{
        fs.readFile(absolutePath,"utf8",(err,data) =>{
            if(err){
                reject(err)
            }else {
                resolve(data);
            }
        })
    })

}

export const Delete = async (key:string) =>{

}
export const createNewFile = async (key:string) =>{

}

export const createNewFolder = async (key:string) =>{

}

export const renameFile = async (key:string, newKey:string) =>{

}
export const renameFolder = async (key:string, newKey:string) =>{

}

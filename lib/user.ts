import path from 'path'
import fs from 'fs'

const userDir = path.join(process.cwd(), 'userData')

export function getUserById(id: string) {
    const fullPath = path.join(userDir, `${id}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return {
        id,
        data: JSON.parse(fileContents)
    }
}

export function getUserData() {
    const fileNames = fs.readdirSync(userDir)
    const allUserData = fileNames.map(fileName => {
        const id = fileName.replace(/\.json$/, '');

        // read in json
        const fullPath = path.join(userDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        return {
            id,
            data: JSON.parse(fileContents)
        }
    });

    return allUserData
}
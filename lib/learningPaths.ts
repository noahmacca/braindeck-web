import path from 'path'
import fs from 'fs'

const lpDir = path.join(process.cwd(), 'learningPaths')

export function getLearningPathData() {
    const fileNames = fs.readdirSync(lpDir)
    const allLpData = fileNames.map(fileName => {
        const id = fileName.replace(/\.json$/, '');

        // read in json
        const fullPath = path.join(lpDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        return {
            id,
            data: JSON.parse(fileContents)
        }
    });

    return allLpData

}
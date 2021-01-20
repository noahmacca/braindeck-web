import path from 'path'
import fs from 'fs'

const lpDir = path.join(process.cwd(), 'learningPaths')

export function getLearningPathById(id: string) {
    const fullPath = path.join(lpDir, `${id}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return {
        id,
        data: JSON.parse(fileContents)
    }
}

export function getLearningPathIds() {
    const fileNames = fs.readdirSync(lpDir)
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.json$/, '')
            }
        }
    })
}

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

function compareMaxComplete( a, b ) {
    if ( a.maxComplete < b.maxComplete ){
      return 1;
    }
    if ( a.maxComplete > b.maxComplete ){
      return -1;
    }
    return 0;
  }
  

export function getLearningPathDataBySubject() {
    const lps = getLearningPathData()
    const s = {};
    lps.forEach((lp) => {
        const subjectId = lp.data.subject.id;
        if (!(subjectId in s)) {
            s[subjectId] = {
                maxComplete: 0,
                lps: [],
                ...lp.data.subject
            }
        }
        s[subjectId].maxComplete = Math.max(lp.data.countComplete, s[subjectId].maxComplete);
        s[subjectId].lps.push(lp);
    });
    const sArr = Object.keys(s).map(key => s[key]); // TS prefers this way
    sArr.sort(compareMaxComplete);

    return sArr
}
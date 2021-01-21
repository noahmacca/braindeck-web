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

function annotateLpsWithUserData(user: any, lps: any) {
    return lps.map((lp: any) => {
        const isFavorite = user.enrolledLps.some((uLp) => uLp.id === lp.id);
        const isComplete = user.enrolledLps.some((uLp) => (uLp.id === lp.id) && (uLp.completed === true));
        let numContentsTotal = 0;
        let numContentsComplete = 0;
        lp.data.concepts.forEach((concept) => {
            concept.contents.forEach((content) => {
                numContentsTotal += 1;
                numContentsComplete += user.contents.some((uContent) => uContent.id === content.id) ? 1 : 0;
            });
        });
        return {
            id: lp.data.id,
            isFavorite,
            isComplete,
            numContentsTotal, 
            numContentsComplete,
            data: lp.data
        }
    });
}

export function getLearningPathsForUser(user: any) {
    const allLps = getLearningPathData();
    const userLpsFavorited = allLps.filter((lp) => (
        (true)
    ));

    const userLpSummaries = annotateLpsWithUserData(user, allLps);
    const userLpsFiltered = {
        lpCompleted: [],
        lpCompletedButNewContent: [],
        lpFavoriteInProgress: [],
        lpFavoriteNotStarted: []
    }
    userLpSummaries.forEach((userLpSummary) => {
        if (userLpSummary.isComplete === true) {
            if (userLpSummary.numContentsComplete === userLpSummary.numContentsTotal) {
                // Normal completed case
                return userLpsFiltered.lpCompleted.push(userLpSummary);
            }
            if (userLpSummary.numContentsComplete < userLpSummary.numContentsTotal) {
                // Marked completed but more contents present; probably new contents were added since completed
                return userLpsFiltered.lpCompletedButNewContent.push(userLpSummary);
            }
        }
        if (userLpSummary.isFavorite === true) {
            if (userLpSummary.numContentsComplete === 0) {
                return userLpsFiltered.lpFavoriteNotStarted.push(userLpSummary);
            }
            if (userLpSummary.numContentsComplete === userLpSummary.numContentsTotal) {
                console.warn('complete but not marked completed. Showing as completed anyways');
                return userLpsFiltered.lpCompleted.push(userLpSummary);
            }
            // In progress
            return userLpsFiltered.lpFavoriteInProgress.push(userLpSummary);
        }

    })
    
    return userLpsFiltered
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

export function getLearningPathDataBySubject() {
    const lps = getLearningPathData()
    const s = {};
    lps.forEach((lp) => {
        const subjectId = lp.data.subject.id;
        if (!(subjectId in s)) {
            s[subjectId] = {
                maxFavorite: 0,
                lps: [],
                ...lp.data.subject
            }
        }
        s[subjectId].maxFavorite = Math.max(lp.data.countFavorite, s[subjectId].maxFavorite);
        s[subjectId].lps.push(lp);
    });

    return s
}
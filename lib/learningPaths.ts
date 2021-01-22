import path from 'path'
import fs from 'fs'
import { getUserById } from './user';

const lpDir = path.join(process.cwd(), 'learningPaths')

export function getLearningPathById(id: string) {
    const fullPath = path.join(lpDir, `${id}.json`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return {
        id,
        data: JSON.parse(fileContents)
    }
}

function annotateLpWithUserData(user: any, lp: any) {
    const isFavorite = user.enrolledLps.some((uLp) => uLp.id === lp.id);
    const isComplete = user.enrolledLps.some((uLp) => (uLp.id === lp.id) && (uLp.isComplete === true));
    const isCreator = user.id === lp.data.author.id;
    let numContentsTotal = 0;
    let numContentsComplete = 0;
    const completedContentIds = [];
    lp.data.concepts.forEach((concept) => {
        concept.contents.forEach((content) => {
            numContentsTotal += 1;
            if (user.contents.some((uContent) => uContent.id === content.id)) {
                numContentsComplete += 1;
                completedContentIds.push(content.id);
            }
        });
    });
    return {
        id: lp.data.id,
        isFavorite,
        isComplete,
        isCreator,
        numContentsTotal,
        numContentsComplete,
        completedContentIds,
        data: lp
    }
}

export function getLearningPathForUser(lpId: string, userId: string) {
    const learningPath = getLearningPathById(lpId);
    const user = getUserById(userId);
    const userLpSummary = annotateLpWithUserData(user.data, learningPath);
    return userLpSummary;
}

export function getCreatedLearningPathsForUser(user: any) {
    const allLps = getLearningPathData();
    const userCreatedLps = allLps
        .map((lp) => annotateLpWithUserData(user, lp))
        .filter((uLp) => uLp.data.data.author.id === user.id);

    return userCreatedLps
}

export function getLearningPathsForUser(user: any) {
    const allLps = getLearningPathData();
    const userLps = allLps.map((lp) => annotateLpWithUserData(user, lp));

    const userLpsFiltered = {
        lpCompleted: [],
        lpCompletedButNewContent: [],
        lpFavoriteInProgress: [],
        lpFavoriteNotStarted: []
    }
    userLps.forEach((userLpSummary) => {
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
    });

    return userLpsFiltered
}

export function getLearningPathIds() {
    const fileNames = fs.readdirSync(lpDir)
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

export function getLearningPathDataBySubject(user: any) {
    const allLps = getLearningPathData();
    const userLps = allLps.map((lp) => annotateLpWithUserData(user, lp));

    const s = {};
    userLps.forEach((uLp) => {
        const subjectId = uLp.data.data.subject.id;
        if (!(subjectId in s)) {
            s[subjectId] = {
                maxFavorite: 0,
                uLps: [],
                ...uLp.data.data.subject
            }
        }
        s[subjectId].maxFavorite = Math.max(uLp.data.data.countFavorite, s[subjectId].maxFavorite);
        s[subjectId].uLps.push(uLp);
    });

    return s
}

export function getLearningPathSubjectPaths() {
    const allLps = getLearningPathData();

    const s = new Set();

    allLps.forEach((lp) => {
        s.add(lp.data.subject.id);
    });

    const res = []
    s.forEach((i) => { // no map on Set :()
        res.push({
            params: {
                id: i
            }
        })
    });

    return res;
}
import { db } from '../config/firebase';

interface LearningResource {
    id?: string,
    title: string,
    author: string,
    url: string,
    format: string, // TODO: enum
    difficulty: string, // TODO: enum
    takeaway: string
}

interface LearningConcept {
    name: string,
    description: string,
    learningResourceIds: Array<string>
}

interface LearningPath {
    id?: string,
    created: number,
    updated: number,
    title: string,
    subject: string,
    authorId: string,
    learningGoal: string,
    background: string,
    difficulty: string, // TODO: enum
    estDurationBucket: string, // TODO: enum
    countFavorite: number,
    countComplete: number,
    numReviews: number,
    avgRating: number,
    learningConcepts: Array<LearningConcept>
}

////////// Learning Paths //////////
export const createLearningPath = (lp: LearningPath): LearningPath => {
    return
}

export const readLearningPath = (id: string): LearningPath => {
    return
}

export const updateLearningPath = (id: string, update: Object ): LearningPath => {
    return
}

export const deleteLearningPath = (id: string): any => {
    return
}

export const getTopCreatedLearningPaths = (n: number): Array<LearningPath> => {
    return
}

export const getUserFavoriteAndCompleteLearningPaths = (userId: string): Array<LearningPath> => {
    return
}

export const getUserCreatedLearningPaths = (userId: string): Array<LearningPath> => {
    return
}


////////// Learning Resources //////////
export const createLearningResource = (lr: LearningResource): LearningResource => {
    return
}

export const readLearningResource = (id: string): LearningResource => {
    return
}

export const updateLearningResource = (id: string, update: Object): LearningResource => {
    return
}

export const deleteLearningResource = (id: string): any => {
    return
}
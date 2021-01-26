
export interface User {
    uid: string,
    email: string,
    name: string,
    created: number,
    learningPaths: Array<{
        id: string,
        created: number,
        completed?: number,
        favorited?: number
    }>,
    learningResources: Array<{
        id: string,
        created: number,
        completed?: number,
        favorited?: number
    }>,
    favoriteTopics: Array<string> // TODO make these entities
}

export interface LearningResource {
    id?: string,
    created?: number,
    updated?: number,
    title: string,
    author: string,
    url: string,
    format: string, // TODO: enum
    difficulty: string, // TODO: enum
    description?: string,
    highlight?: string
}

export interface LearningConcept {
    id: string,
    title: string,
    description: string,
    learningResources: Array<LearningResource>
}

export interface LearningPathData {
    created?: number,
    updated?: number,
    title: string,
    subject: string,
    authorId: string,
    learningGoal: string,
    background: string,
    difficulty: string, // TODO: enum
    estDurationBucket: string, // TODO: enum
    countFavorite: number,
    countComplete: number,
    countReviews: number,
    avgRating: number,
    learningConcepts: Array<LearningConcept>
}

export interface LearningPath {
    id: string,
    data: LearningPathData
}

export interface LearningPathUser {
    id: string,
    data: LearningPathData,
    userData: {
        isFavorite: boolean,
        isComplete: boolean,
        isCreator: boolean,
        numLearningResourcesTotal: number,
        completedContentIds: Array<string>,
    }
}


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
    }>
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

export interface LearningPath {
    id?: string,
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
    numReviews: number,
    avgRating: number,
    learningConcepts: Array<LearningConcept>
}

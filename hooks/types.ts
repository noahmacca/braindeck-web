
export interface User {
    uid: string,
    email: string,
    name: string,
    created: number,
    bio: string,
    learningPaths: Array<{
        id: string,
        created: number,
        updated: number
        isCompleted?: boolean,
        isFavorited?: boolean,
        rating?: number,
    }>,
    learningResources: Array<{
        id: string,
        created: number,
        updated: number,
        isCompleted?: boolean,
        isFavorited?: boolean
    }>,
    favoriteTopics: Array<string> // TODO make these entities
}

export interface InitUserDocData {
    uid: string;
    name: string;
    email: string;
    bio: string;
    favoriteTopics: Array<string>;
}

export interface UserInputSignupData {
    name: string;
    email: string;
    password: string;
    bio: string;
    favoriteTopics: Array<string>;
}

export interface UserInfoUpdate {
    uId: string,
    name: string;
    bio: string;
    favoriteTopics: Array<string>;
}

export interface UserInputLearningResourceData {
    title: string,
    source: string,
    url: string,
    imgUrl: string
    format: string, // TODO: enum
    difficulty: string, // TODO: enum
    description?: string,
    highlight?: string
}

export interface LearningResource {
    id?: string,
    created?: number,
    updated?: number,
    title: string,
    source: string,
    url: string,
    imgUrl: string,
    format: string, // TODO: enum
    difficulty: string, // TODO: enum
    description?: string,
    highlight?: string
}

export interface UserInputLearningConceptData {
    title: string,
    description:string,
}

export interface LearningConcept {
    id?: string,
    title: string,
    created: number,
    updated: number,
    description: string,
    learningResources: Array<LearningResource>
}

export interface UserInputLearningPathData {
    title: string,
    subject: string,
    learningGoal: string,
    background: string,
    difficulty: string, // TODO: enum
    duration: string, // TODO: enum
}

export interface LearningPathData {
    created: number,
    updated: number,
    title: string,
    subject: string,
    author: {
        uid: string,
        name: string,
        bio: string,
    },
    learningGoal: string,
    background: string,
    difficulty: string, // TODO: enum
    duration: string, // TODO: enum
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
        rating: number,
        numLearningResourcesTotal: number,
        countByResourceFormat: Object,
        completedContentIds: Array<string>,
        progress: number,
    }
}

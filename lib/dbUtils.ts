import { db } from '../config/firebase';

interface User {
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

interface LearningResource {
    id?: string,
    title: string,
    author: string,
    url: string,
    format: string, // TODO: enum
    difficulty: string, // TODO: enum
    description?: string,
    highlight?: string
}

interface LearningConcept {
    title: string,
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
export const createLearningPath = (lp: LearningPath) => {
    return db.collection('learningPaths')
        .add(lp)
        .then((docRef) => {
            return docRef
        })
        .catch((err) => {
            console.error('Error adding document: ', err);
            return { err };
        });
}

export const getLearningPath = (id: string) => {
    return db.collection('learningPaths').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                console.log('got document ', doc);
                return doc
            }
        })
        .catch((err) => {
            console.log("Error getting document:", err);
            return { err }
        })
}

export const updateLearningPath = (id: string, update: Object) => {
    return db.collection('learningPaths').doc(id).update(update)
        .then(() => {
            console.log('updated ', id);
            return true
        })
        .catch((err) => {
            console.error("Error updating document: ", err);
            return false
        })
}

export const deleteLearningPath = (id: string) => {
    return db.collection('learningPaths').doc(id).delete()
        .then(() => {
            console.log('Deleted ', id);
            return true
        }).catch((err) => {
            console.error("Error removing document: ", err);
            return false
        });
}

export const getTopCreatedLearningPaths = (n: number) => {
    return db.collection('learningPaths').orderBy('countFavorite', 'desc').limit(20).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
            return querySnapshot
        }).catch((err) => {
            console.log("Error getting documents: ", err);
            return { err }
        })
}

export const getUserLearningPaths = (user: User) => {
    // TODO
    return
}

export const getAllLearningPaths = () => {
    return db.collection('learningPaths').get()
        .then((querySnapshot) => {
            console.log('querySnapshot', querySnapshot);
            const res = [];
            querySnapshot.docs.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                res.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return res
        }).catch((err) => {
            console.log("Error getting documents: ", err);
            return { err }
        })
}
export const getUserCreatedLearningPaths = (userId: string) => {
    return db.collection('learningPaths').where('authorId', '==', userId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
            });
            return querySnapshot
        }).catch((err) => {
            console.log("Error getting documents: ", err);
            return { err }
        })
}

////////// Learning Resources //////////
export const createLearningResource = (lr: LearningResource) => {
    return
}

export const readLearningResource = (id: string) => {
    return
}

export const updateLearningResource = (id: string, update: Object) => {
    return
}

export const deleteLearningResource = (id: string) => {
    return
}

export default {
    createLearningPath,
    getLearningPath,
    updateLearningPath,
    deleteLearningPath,
    getTopCreatedLearningPaths,
    getUserLearningPaths,
    getAllLearningPaths,
    getUserCreatedLearningPaths
}
import { db } from '../config/firebase';
import firebase from 'firebase/app';
import { v4 } from 'uuid';

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

interface LearningConcept {
    title: string,
    description: string,
    learningResources: Array<LearningResource>
}

interface LearningPath {
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

const initLearningPath = (lp: LearningPath) => {
    const initLp = lp;
    // add created and updated to learning path
    const nowMs = Date.now();;
    initLp.created = nowMs;
    initLp.updated = nowMs;
    
    // for each learningResource for each learningConcept, add id, created, and updated
    initLp.learningConcepts.forEach((lc) => {
        lc.learningResources.forEach((lr) => {
            lr.created = nowMs;
            lr.updated = nowMs;
            lr.id = v4();
        });
    });

    return initLp
}

////////// Learning Paths //////////
export const createLearningPath = (lp: LearningPath) => {
    const lpInit = initLearningPath(lp);

    return db.collection('learningPaths')
        .add(lpInit)
        .then((docRef) => {
            return docRef
        })
        .catch((err) => {
            console.error('Error adding document: ', err);
            return { err };
        });
}

export const getLearningPath = (id: string): any => {
    return db.collection('learningPaths').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                return { id: doc.id, ...doc.data() }
            }
        })
        .catch((err) => {
            console.log("Error getting document:", err);
            return { err }
        })
}

export const getLearningPathWithLearningResources = (id: string) => {
    return getLearningPath(id).then((learningPath) => {
        const promises = [];
        console.log('learningPath', learningPath);
        learningPath.learningConcepts.val().forEach((learningConcept) => {
            console.log('learningConcept', learningConcept);
            learningConcept.learningResourceIds.forEach((lrId) => {
                promises.push(getLearningResource(lrId));
            });
        });
        return Promise.all(promises);
    })
    .then((learningResources) => {
        console.log('got back all learning resources', learningResources)
        return learningResources
    })
    .catch((err) => {
        console.log(err);
    });
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
            const res = [];
            querySnapshot.docs.forEach((doc) => {
                res.push({
                    id: doc.id,
                    data: doc.data()
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
export const createLearningResource = (lr: LearningResource, lpId: string, conceptIdx: number): any => {
    lr.created = Date.now();
    lr.updated = Date.now();

    return db.collection('learningResources')
        .add(lr)
        .then((docRef) => {
            console.log('Created new learningResource with ID', docRef.id);
            addLearningResourceToLearningPath(docRef.id, lpId, conceptIdx)
                .then((res) => {
                    console.log('Updated Learning Path with Ref to this resource', res);
                    return res
                })
        })
        .catch((err) => {
            console.error('Error adding document: ', err);
            return { err };
        });
}

export const addLearningResourceToLearningPath = (lrId: string, lpId: string, conceptIdx: number) => {
    const k = `learningConcepts.${conceptIdx}.learningResourceIds`;
    return updateLearningPath(lpId, {
        [k]: firebase.firestore.FieldValue.arrayUnion(lrId)
    })
}

export const getLearningResource = (id: string) => {
    return db.collection('learningResources').doc(id).get()
        .then((doc) => {
            if (doc.exists) {
                return { id: doc.id, ...doc.data() }
            }
        })
        .catch((err) => {
            console.log("Error getting document:", err);
            return { err }
        })
}

export const getLearningResources = (ids: Array<string>) => {

    return
}

export const updateLearningResource = (id: string, update: Object) => {
    return
}

export const deleteLearningResource = (id: string) => {
    // TODO: Remove record and remove pointer from learning path
    return
}

export default {
    createLearningPath,
    getLearningPath,
    getLearningPathWithLearningResources,
    updateLearningPath,
    deleteLearningPath,
    getTopCreatedLearningPaths,
    getUserLearningPaths,
    getAllLearningPaths,
    getUserCreatedLearningPaths,
    createLearningResource
}
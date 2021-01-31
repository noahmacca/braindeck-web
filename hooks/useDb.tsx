import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from 'react';
import { db } from '../config/firebase';
import { v4 } from 'uuid';
import { useAuth } from './useAuth'
import firebase from 'firebase/app';
import {
    LearningPath,
    LearningPathData,
    User,
    LearningPathUser
} from './types';
const dbContext = createContext({ userLearningPaths: [], user: null });
const { Provider } = dbContext;

export function DbProvider(props: { children: ReactNode }): JSX.Element {
    const db = useDbProvider();
    return <Provider value={db}>{props.children}</Provider>
}

export const useDb: any = () => {
    return useContext(dbContext);
}

const useDbProvider = () => {
    const [learningPaths, setLearningPaths]: [Array<LearningPathUser>, any] = useState([]);
    const [userLearningPaths, setUserLearningPaths]: [any, any] = useState([]);
    const [user, setUser]: [any, any] = useState(null);
    const auth = useAuth();

    // On mount, subscribe to changes in user doc, and update learningPaths
    useEffect(() => {
        if (learningPaths.length === 0) {
            const unsubscribe = db
                .collection('learningPaths')
                .onSnapshot((querySnapshot) => {
                    const lps: Array<LearningPath> = [];
                    querySnapshot.docs.forEach((doc) => {
                        const lp = {
                            id: doc.id,
                            data: doc.data() as LearningPathData
                        }
                        lps.push(lp);
                    });
                    setLearningPaths(lps);
                });
            return () => unsubscribe();
        }
    }, []);

    // On recepit of userId, subscribe to that user doc, and update user
    useEffect(() => {
        if (auth.userId && auth.userId.length > 0) {
            const unsubscribe = db
                .collection('users')
                .doc(auth.userId)
                .onSnapshot((doc) => {
                    const user: User = doc.data() as User;
                    setUser(user);
                })
            return () => unsubscribe()
        }
    }, [auth.userId]);

    // update userLearningPaths when user or learningPaths updates
    useEffect(() => {
        // if we update user or learningPaths, update userLearningPaths
        const userLearningPaths = learningPaths.map((lp) => annotateLearningPathsWithUserData(lp, user));
        setUserLearningPaths(userLearningPaths);
    }, [user, learningPaths])

    const annotateLearningPathsWithUserData = (lp: LearningPath, user: User): LearningPathUser => {
        const lpu = {
            ...lp,
            userData: {
                isFavorite: false,
                isComplete: false,
                isCreator: false,
                numLearningResourcesTotal: 0,
                completedContentIds: [],
            }
        }

        if (!user?.uid) {
            // Might not have user object
            return lpu
        }

        lpu.userData.isFavorite = user.learningPaths.some((uLp) => (uLp.id === lp.id) && (uLp.isFavorited));
        lpu.userData.isComplete = user.learningPaths.some((uLp) => (uLp.id === lp.id) && (uLp.isCompleted));
        lpu.userData.isCreator = user.uid === lp.data.author.uid,

            lpu.data.learningConcepts.forEach((concept) => {
                concept.learningResources.forEach((resource) => {
                    lpu.userData.numLearningResourcesTotal += 1
                    if (user.learningResources.some((uResource) => uResource.id === resource.id)) {
                        lpu.userData.completedContentIds.push(resource.id);
                    }
                });
            });

        return lpu
    }

    const setLpFavorite = ({ lpId, uId, isFavorite }: { lpId: string, uId: string, isFavorite: boolean }) => {
        // Update user docs
        const updatedUserLearningPaths = user.learningPaths;
        let isMatch = false
        updatedUserLearningPaths.forEach((uLp) => {
            if (uLp.id === lpId) {
                // update existing
                uLp.updated = Date.now();
                uLp.isFavorited = isFavorite;
                isMatch = true
            }
        });
        if (!isMatch) {
            // create new
            updatedUserLearningPaths.push({
                id: lpId,
                created: Date.now(),
                updated: Date.now(),
                isFavorited: isFavorite
            });
        }
        
        // Update learningPaths doc
        updateDoc('learningPaths', lpId, {
            countFavorite: firebase.firestore.FieldValue.increment(isFavorite ? 1 : -1),
        });
        updateDoc('users', uId, {
            learningPaths: updatedUserLearningPaths,
        });
    }

    const setLpRating = ({ lpId, uId, rating }: { lpId: string, uId: string, rating: number }) => {
        console.log('setLpRating', lpId, uId, rating);
        // See if user has rated this learningPath
        const updatedUserLearningPaths = user.learningPaths;
        let currUserRating = null;
        updatedUserLearningPaths.forEach((uLp) => {
            if (uLp.id === lpId) {
                uLp.updated = Date.now();
                currUserRating = uLp.rating; // track the current rating to update the avg
                uLp.rating = rating;
            }
        });
        if (!currUserRating) {
            // create new
            updatedUserLearningPaths.push({
                id: lpId,
                created: Date.now(),
                updated: Date.now(),
                rating,
            });
        }
        console.log('currUserRating', currUserRating)

        updateDoc('users', uId, {
            learningPaths: updatedUserLearningPaths,
        });

        // Update the avgRating and countRating on the LP itself
        let currAvgRating = 0;
        let currN = 0;
        let newAvgRating = 0;
        let newN = 0;
        userLearningPaths.forEach((uLp: LearningPathUser) => {
            if (uLp.id === lpId) {
                currAvgRating = uLp.data.avgRating;
                currN = uLp.data.countReviews
            }
        });

        if (!currUserRating) {
            // New rating
            newN = currN + 1
            newAvgRating = ((currAvgRating * currN) + rating) / newN
            console.log('no currUserRating', currN, newN, currAvgRating, newN)
        } else {
            // altered existing rating
            newAvgRating = ((currAvgRating * currN) - currUserRating + rating) / (currN)
            newN = currN
            console.log('no currUserRating', currN, newN, currAvgRating, newN)
        }

        return updateDoc('learningPaths', lpId, {
            avgRating: newAvgRating,
            countReviews: newN
        });
    }

    const setLearningResourceComplete = ({ uId, lrId, isComplete }: { uId: string, lrId: string, isComplete: boolean }) => {
        // update user doc only
        const updatedUserLearningResources = user.learningResources;
        const nowMs = Date.now();
        let isMatch = false;
        updatedUserLearningResources.forEach((uLr) => {
            if (uLr.id === lrId) {
                uLr.updated = nowMs;
                uLr.isCompleted = isComplete;
                isMatch = true;
            }
        });

        if (!isMatch) {
            // add new entry
            updatedUserLearningResources.push({
                id: lrId,
                created: nowMs,
                updated: nowMs,
                isCompleted: true,
            });
        }

        updateDoc('users', uId, {
            learningResources: updatedUserLearningResources,
        });
    }

    const setUserName = ({ uId, name }: { uId: string, name: string }) => {
        return db.collection('users').doc(uId).update({
            name,
        }).then(() => {
            console.log('updated', uId);
            return true
        }).catch((err) => {
            console.error("Error updating document: ", err);
            return false
        });
    }

    const initLearningPath = (lp: LearningPathData): LearningPathData => {
        const initLp = lp;
        // add created and updated to learning path
        const nowMs = Date.now();
        initLp.created = nowMs;
        initLp.updated = nowMs;

        // for each learningResource for each learningConcept, add id, created, and updated
        initLp.learningConcepts.forEach((lc) => {
            lc.id = v4();
            lc.learningResources.forEach((lr) => {
                lr.created = nowMs;
                lr.updated = nowMs;
                lr.id = v4();
            });
        });

        return initLp
    }

    const createLearningPath = (lp: LearningPathData) => {
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

    const getLearningPathById = (id: string): any => {
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

    const updateDoc = (collection: string, docId: string, update: Object) => {
        return db.collection(collection).doc(docId).update(update)
            .then(() => {
                console.log('updated ', docId);
                return true
            })
            .catch((err) => {
                console.error("Error updating document: ", err);
                return false
            })

    }

    const deleteLearningPath = (id: string) => {
        return db.collection('learningPaths').doc(id).delete()
            .then(() => {
                console.log('Deleted ', id);
                return true
            }).catch((err) => {
                console.error("Error removing document: ", err);
                return false
            });
    }

    ////////// Helper Functions //////////

    return {
        user,
        userLearningPaths,
        setLpFavorite,
        setUserName,
        createLearningPath,
        setLpRating,
        getLearningPathById,
        updateDoc,
        deleteLearningPath,
        setLearningResourceComplete,
    }
}

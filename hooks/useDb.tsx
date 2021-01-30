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
                numLearningResourcesTotal: 1,
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
            }
        });
        if (!isMatch) {
            // create new
            updatedUserLearningPaths.push({
                id: lpId,
                created: Date.now(),
                updated: Date.now(),
                isFavorited: isFavorite
            })
        }

        // Update learningPaths doc
        db.collection('learningPaths').doc(lpId).update({
            countFavorite: firebase.firestore.FieldValue.increment(isFavorite ? 1 : -1)
        }).then(() => {
            console.log('updated ', lpId);
            return true
        })
        .catch((err) => {
            console.error("Error updating document: ", err);
            return false
        })

        // Update user doc
        db.collection('users').doc(uId).update({
            learningPaths: updatedUserLearningPaths,
        }).then(() => {
            console.log('updated ', uId);
            // Now increment or decrement the number of favorites on the lp
            var washingtonRef = db.collection('cities').doc('DC');
        }).catch((err) => {
            console.error("Error updating document: ", err);
            return false
        });
    }

    const setUserRating = ({ lpId, uId, rating }: { lpId: string, uId: string, rating: number }) => {
        console.log('setUserRating', lpId, uId, rating);
        return
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

    const updateLearningPath = (id: string, update: Object) => {
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
        setUserRating,
        getLearningPathById,
        updateLearningPath,
        deleteLearningPath,
    }
}

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
    UserInputLearningPathData,
    UserInputLearningConceptData,
    UserInputLearningResourceData,
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

function compareByUpdated(a, b) {
    if (a.data.updated < b.data.updated) {
        return 1;
    }
    if (a.data.updated > b.data.updated) {
        return -1;
    }
    return 0;
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
            return () => {
                unsubscribe();
                setUser(null);
            }
        }
    }, [auth.userId]);

    // update userLearningPaths when user or learningPaths updates
    useEffect(() => {
        // if we update user or learningPaths, update userLearningPaths
        const userLearningPaths = learningPaths.map((lp) => annotateLearningPathsWithUserData(lp, user));
        userLearningPaths.sort(compareByUpdated)
        setUserLearningPaths(userLearningPaths);
    }, [user, learningPaths])

    const annotateLearningPathsWithUserData = (lp: LearningPath, user: User): LearningPathUser => {
        const lpu = {
            ...lp,
            userData: {
                isFavorite: false,
                isComplete: false,
                isCreator: false,
                rating: 0,
                numLearningResourcesTotal: 0,
                completedContentIds: [],
                progress: 0.0,
            }
        }

        if (!user?.uid) {
            // Might not have user object yet
            return lpu
        }

        user.learningPaths.forEach((uLp) => {
            if (uLp.id === lp.id) {
                lpu.userData.isFavorite = uLp.isFavorited ? uLp.isFavorited : false;
                // TODO: Actually set/remove isComplete. Note that this is separate from progress == 1.0 because the creator can add more
                // resources in the future, and it's helpful to know that the user previously completed and new things were
                // added in the future.
                lpu.userData.isComplete = uLp.isCompleted ? uLp.isCompleted : false;
                lpu.userData.isCreator = user.uid === lp.data.author.uid;
                lpu.userData.rating = uLp.rating ? uLp.rating : 0;
            }
        })

        // lpu.userData.isFavorite = user.learningPaths.some((uLp) => (uLp.id === lp.id) && (uLp.isFavorited));
        // lpu.userData.isComplete = user.learningPaths.some((uLp) => (uLp.id === lp.id) && (uLp.isCompleted));
        // lpu.userData.isCreator = user.uid === lp.data.author.uid;
        
        lpu.data.learningConcepts.forEach((concept) => {
            concept.learningResources.forEach((resource) => {
                lpu.userData.numLearningResourcesTotal += 1
                if (user.learningResources.some((uResource) => (uResource.id === resource.id) && (uResource.isCompleted))) {
                    lpu.userData.completedContentIds.push(resource.id);
                }
            });
        });
        
        lpu.userData.progress = lpu.userData.numLearningResourcesTotal > 0 ? lpu.userData.completedContentIds.length / lpu.userData.numLearningResourcesTotal : 0
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
        } else {
            // altered existing rating
            newAvgRating = ((currAvgRating * currN) - currUserRating + rating) / (currN)
            newN = currN
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

    const initLearningPath = (lpUserInput: UserInputLearningPathData): LearningPathData => {
        const nowMs = Date.now();
        return {
            ...lpUserInput,
            created: nowMs,
            updated: nowMs,
            author: {
                uid: user.uid,
                name: user.name
            },
            countFavorite: 0,
            countComplete: 0,
            countReviews: 0,
            avgRating: 0,
            learningConcepts: []
        }
        // for each learningResource for each learningConcept, add id, created, and updated
        // initLp.learningConcepts.forEach((lc) => {
        //     lc.id = v4();
        //     lc.learningResources.forEach((lr) => {
        //         lr.created = nowMs;
        //         lr.updated = nowMs;
        //         lr.id = v4();
        //     });
        // });
    }

    ////////////// LEARNING PATH //////////////
    const createLearningPath = (lpUserInput: UserInputLearningPathData) => {
        const lp = initLearningPath(lpUserInput);
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

    const updateLearningPath = (lpId: string, lpUserInput: UserInputLearningPathData) => {
        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            ...lpUserInput
        })
    }

    ////////////// LEARNING CONCEPT //////////////
    const createLearningConcept = (lpId: string, lcUserInput: UserInputLearningConceptData) => {
        const nowMs = Date.now();
        const lc = {
            id: v4(),
            ...lcUserInput,
            created: nowMs,
            updated: nowMs,
            learningResources: []
        };

        const lp = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        lp.data.learningConcepts.push(lc);
        return updateDoc('learningPaths', lpId, {
            learningConcepts: lp.data.learningConcepts
        });
    }

    const updateLearningConcept = (lpId: string, lcId: string, lcUserInput: UserInputLearningConceptData) => {
        let isMatch = false;
        const lpMatch = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        const lcsNew = lpMatch.data.learningConcepts.map((lc) => {
            if (lc.id === lcId) {
                isMatch = true;
                lc.updated = Date.now();
                lc.title = lcUserInput.title;
                lc.description = lcUserInput.description;
            }
            return lc
        })
        if (!isMatch) {
            console.warn('no matching learning concept found; not updating');
            return null
        }
        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            learningConcepts: lcsNew
        });
    }

    const deleteLearningConcept = (lpId: string, lcId: string) => {
        console.log('deleting learning concept', lpId, lcId);
        let isMatch = false;
        const lpMatch = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        const lcsNew = []
        lpMatch.data.learningConcepts.forEach((lc) => {
            if (lc.id === lcId) {
                isMatch=true;
                return null
            }
            lcsNew.push(lc)
        })
        if (!isMatch) {
            console.warn('no matching learning concept found; not updating');
            return null
        }
        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            learningConcepts: lcsNew
        });
    }

    ////////////// LEARNING CONCEPT //////////////
    const createLearningResource = (lpId: string, lcId: string, lrUserInput: UserInputLearningResourceData) => {
        const nowMs = Date.now();
        const lr = {
            id: v4(),
            created: nowMs,
            updated: nowMs,
            ...lrUserInput
        };

        let isMatch = false;
        const lpMatch: LearningPathUser = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        const lcsNew = lpMatch.data.learningConcepts.map((lc) => {
            if (lc.id === lcId) {
                isMatch = true;
                lc.learningResources.push(lr);
                lc.updated = Date.now();
            }
            return lc
        })
        if (!isMatch) {
            console.warn('no matching learning concept found; not updating');
            return null
        }
        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            learningConcepts: lcsNew
        });
    }

    const updateLearningResource = (lpId: string, lcId: string, lrId: string, lrUserInput: UserInputLearningResourceData) => {
        let isMatch = false;
        const lpMatch: LearningPathUser = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        const lcsNew = lpMatch.data.learningConcepts.map((lc) => {
            if (lc.id === lcId) {
                lc.learningResources.forEach((lr) => {
                    if (lr.id === lrId) {
                        isMatch = true;
                        lr.updated = Date.now();
                        lr.title = lrUserInput.title;
                        lr.author = lrUserInput.author;
                        lr.url = lrUserInput.url;
                        lr.format = lrUserInput.format;
                        lr.difficulty = lrUserInput.difficulty;
                        lr.description = lrUserInput.description;
                        lr.highlight = lrUserInput.highlight;
                    }
                })
            }
            return lc
        })
        if (!isMatch) {
            console.warn('no matching learning concept found; not updating');
            return null
        }
        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            learningConcepts: lcsNew
        });
    }

    const deleteLearningResource = (lpId: string, lcId: string, lrId: string) => {
        console.log('deleting learning resource', lpId, lcId, lrId);
        let isMatch = false;
        const lpMatch: LearningPathUser = userLearningPaths.filter((uLp) => uLp.id === lpId)[0]
        const lrsNew = []
        const lcsNew = lpMatch.data.learningConcepts.map((lc) => {
            if (lc.id === lcId) {
                lc.learningResources.forEach((lr) => {
                    if (lr.id === lrId) {
                        isMatch=true;
                    } else {
                        lrsNew.push(lr);
                    }
                })
                lc.learningResources = lrsNew;
                lc.updated = Date.now();
            }
            return lc
        })
        if (!isMatch) {
            console.warn('no matching learning concept found; not updating');
            return null
        }

        return updateDoc('learningPaths', lpId, {
            updated: Date.now(),
            learningConcepts: lcsNew
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
        updateLearningPath,
        createLearningConcept,
        updateLearningConcept,
        deleteLearningConcept,
        createLearningResource,
        updateLearningResource,
        deleteLearningResource,
        setLpRating,
        getLearningPathById,
        updateDoc,
        deleteLearningPath,
        setLearningResourceComplete,
    }
}

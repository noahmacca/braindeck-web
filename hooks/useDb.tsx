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
import {
    LearningPath,
    LearningPathData,
    User,
    LearningPathUser
} from './types';
const dbContext = createContext({ learningPaths: [] });
const { Provider } = dbContext;

export function DbProvider(props: { children: ReactNode }): JSX.Element {
    const db = useDbProvider();
    return <Provider value={db}>{props.children}</Provider>
}

export const useDb: any = () => {
    return useContext(dbContext);
}

const useDbProvider = () => {
    const [learningPaths, setLearningPaths] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        const learningPathsNew = learningPaths.map((lp) => annotateLearningPathsWithUserData(lp, auth.user));
        setLearningPaths(learningPathsNew);
    }, [auth.user])

    ////////// Users //////////
    // Subscribe to changes to user doc
    useEffect(() => {
        if (learningPaths.length === 0) {
            // Subscribe to user document on mount
            const unsubscribe = db
                .collection('learningPaths')
                .onSnapshot((querySnapshot) => {
                    const lps: Array<LearningPath> = [];
                    querySnapshot.docs.forEach((doc) => {
                        const lp = {
                            id: doc.id,
                            data: doc.data() as LearningPathData
                        }
                        const lpUser = annotateLearningPathsWithUserData(lp, auth.user);
                        lps.push(lpUser)
                    });
                    setLearningPaths(lps);
                });
            return () => unsubscribe();
        }
    }, []);

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

        lpu.userData.isFavorite = user.learningPaths.some((uLp) => uLp.id === lp.id),
            lpu.userData.isComplete = user.learningPaths.some((uLp) => (uLp.id === lp.id) && (uLp.completed)),
            lpu.userData.isCreator = user.uid === lp.data.authorId,

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

    ////////// Learning Paths //////////
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

    const getAllLearningPaths = () => {
        return db.collection('learningPaths').get()
            .then((querySnapshot) => {
                const res = [];
                querySnapshot.docs.forEach((doc) => {
                    res.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                setLearningPaths(res);
                return res
            }).catch((err) => {
                console.log("Error getting documents: ", err);
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

    return {
        learningPaths,
        createLearningPath,
        getLearningPathById,
        getAllLearningPaths,
        updateLearningPath,
        deleteLearningPath
    }
}

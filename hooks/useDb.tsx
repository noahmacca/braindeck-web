import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from 'react';
import { db } from '../config/firebase';
import { v4 } from 'uuid';
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

    ////////// Users //////////
    // Subscribe to changes to user doc
    useEffect(() => {
        if (learningPaths.length === 0) {
            // Subscribe to user document on mount
            const unsubscribe = db
                .collection('learningPaths')
                .onSnapshot((querySnapshot) => {
                    const res = [];
                    querySnapshot.docs.forEach((doc) => {
                        res.push({
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                    setLearningPaths(res);
                });
            return () => unsubscribe();
        }
    }, []);

    ////////// Learning Paths //////////
    const initLearningPath = (lp) => {
        const initLp = lp;
        // add created and updated to learning path
        const nowMs = Date.now();;
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

    const createLearningPath = (lp) => {
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

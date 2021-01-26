import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../config/firebase';
import {
    User
} from './types';
const authContext = createContext({ user: {} });
const { Provider } = authContext;

export function AuthProvider(props: { children: ReactNode }): JSX.Element {
    const auth = useAuthProvider();
    return <Provider value={auth}>{props.children}</Provider>;
}

export const useAuth: any = () => {
    return useContext(authContext);
};

export const useRequireAuth = () => {
    const auth = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!auth.user) {
            router.push('/login');
        }
    }, [auth, router]);

    return auth;
};

interface NewUserInput {
    uid: string,
    email: string,
    name: string
}

export const initializeUserDoc = (user: NewUserInput): User => {
    return {
        uid: user.uid,
        email: user.email,
        name: user.name,
        created: Date.now(),
        learningPaths: [],
        learningResources: [],
        favoriteTopics: []
    }
}

// Provider hook that creates an auth object and handles it's state
const useAuthProvider = () => {
    const [user, setUser]: [User, any] = useState(null);
    const createUser = (newUser: NewUserInput) => {
        const userInit = initializeUserDoc(newUser)

        return db
            .collection('users')
            .doc(userInit.uid)
            .set(userInit)
            .then(() => {
                setUser(userInit);
                return userInit;
            })
            .catch((error) => {
                return { error };
            });
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(handleAuthStateChanged);
        return () => unsub();
    }, []);

    useEffect(() => {
        if (user?.uid) {
            // Subscribe to user document on mount
            const unsubscribe = db
                .collection('users')
                .doc(user.uid)
                .onSnapshot((doc) => {
                    const user: User = doc.data() as User;
                    console.log('updated user doc', user);
                    setUser(user);
                })
            return () => unsubscribe();
        }
    }, []);

    const signUp = ({ name, email, password }) => {
        return auth
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                auth.currentUser.sendEmailVerification();
                return createUser({
                    uid: response.user.uid,
                    email,
                    name,
                });
            })
            .catch((error) => {
                return { error };
            });
    };

    const getUserAdditionalData = (user) => {
        return db
            .collection('users')
            .doc(user.uid)
            .get()
            .then((userData) => {
                if (userData.data()) {
                    const user: User = userData.data() as User;
                    setUser(user);
                }
            });
    };

    const signIn = ({ email, password }) => {
        return auth
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                setUser(response.user);
                getUserAdditionalData(response.user);
                return response.user;
            })
            .catch((error) => {
                return { error };
            });
    };

    const handleAuthStateChanged = (user) => {
        console.log('handleAuthStateChanged');
        setUser(user);
        if (user) {
            getUserAdditionalData(user);
        }
    };

    const signOut = () => {
        return auth.signOut().then(() => setUser(false));
    };

    const sendPasswordResetEmail = (email) => {
        return auth.sendPasswordResetEmail(email).then((response) => {
            console.log('sendPasswordResetEmail', response);
            return response;
        })
            .catch((error) => {
                return { error };
            });
    };

    ////////// Helper Functions //////////
    const setLpFavorite = ({lpId, uId, isFavorite}: {lpId: string, uId: string, isFavorite: boolean}) => {
        // local should reflect remote
        const updatedUserLearningPaths = user.learningResources;
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

        return db.collection('users').doc(uId).update({
            learningPaths: updatedUserLearningPaths,
        }).then(() => {
            console.log('updated ', uId);
            return true
        }).catch((err) => {
            console.error("Error updating document: ", err);
            return false
        });
    }

    return {
        user,
        signUp,
        signIn,
        signOut,
        sendPasswordResetEmail,
        setLpFavorite
    };
};
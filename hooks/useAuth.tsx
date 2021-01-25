import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../config/firebase';
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

export const initializeUserDoc = (user) => {
    return {
        ...user,
        created: Date.now(),
        learningPaths: [],
        learningResources: []
    }
}

// Provider hook that creates an auth object and handles it's state
const useAuthProvider = () => {
    const [user, setUser] = useState(null);
    const createUser = (user) => {
        const userInitDoc = initializeUserDoc(user)

        return db
            .collection('users')
            .doc(userInitDoc.uid)
            .set(userInitDoc)
            .then(() => {
                setUser(userInitDoc);
                return userInitDoc;
            })
            .catch((error) => {
                return { error };
            });
    };

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
                    setUser(userData.data());
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
        setUser(user);
        if (user) {
            getUserAdditionalData(user);
        }
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
                .onSnapshot((doc) => setUser(doc.data()));
            return () => unsubscribe();
        }
    }, []);

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

    return {
        user,
        signUp,
        signIn,
        signOut,
        sendPasswordResetEmail
    };
};
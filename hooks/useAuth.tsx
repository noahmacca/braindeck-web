import {
    useState,
    useEffect,
    useContext,
    createContext,
    ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../config/firebase';
import firebase from 'firebase/app';
import {
    User
} from './types';
const authContext = createContext({ authUserId: {} });
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
        if (auth.authUserId === '') {
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
    // authUserId tracks user logged in state from auth.
    // Use this to get full user doc from the db.
    // Three states: null=unknown; ''=not logged in; non-empty string=logged in
    const [authUserId, setAuthUserId] = useState(null);

    const createUser = (newUser: NewUserInput) => {
        const userInit = initializeUserDoc(newUser)

        return db
            .collection('users')
            .doc(userInit.uid)
            .set(userInit)
            .then(() => {
                setAuthUserId(userInit.uid);
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

    const signIn = ({ email, password }) => {
        return auth
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log('signing in, getting userAdditionalData');
                setAuthUserId(response.user.uid);
                return response.user;
            })
            .catch((error) => {
                return { error };
            });
    };

    const handleAuthStateChanged = (newUser) => {
        newUser ? setAuthUserId(newUser.uid) : setAuthUserId('')
    };

    const signOut = () => {
        return auth.signOut().then(() => setAuthUserId(''));
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

    return {
        authUserId,
        signUp,
        signIn,
        signOut,
        sendPasswordResetEmail
    };
};
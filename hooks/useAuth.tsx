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
    User, UserInputSignupData, InitUserDocData
} from './types';
const authContext = createContext({ userId: {} });
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
        if (auth.userId === '') {
            router.push('/login');
        }
    }, [auth, router]);

    return auth;
};

export const initializeUserDoc = (user: InitUserDocData): User => {
    return {
        uid: user.uid,
        email: user.email,
        name: user.name,
        created: Date.now(),
        bio: user.bio,
        favoriteTopics: user.favoriteTopics,
        learningPaths: [],
        learningResources: []
    }
}

// Provider hook that creates an auth object and handles it's state
const useAuthProvider = () => {
    // userId tracks user logged in state from auth.
    // Use this to get full user doc from the db.
    // Three states: null=unknown; ''=not logged in; non-empty string=logged in
    const [userId, setUserId] = useState(null);

    const createUser = (newUser: InitUserDocData) => {
        const userInit = initializeUserDoc(newUser)

        return db
            .collection('users')
            .doc(userInit.uid)
            .set(userInit)
            .then(() => {
                setUserId(userInit.uid);
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

    const signUp = (signupData: UserInputSignupData) => {
        return auth
            .createUserWithEmailAndPassword(signupData.email, signupData.password)
            .then((response) => {
                auth.currentUser.sendEmailVerification();
                return createUser({
                    uid: response.user.uid,
                    email: signupData.email,
                    name: signupData.name,
                    bio: signupData.bio,
                    favoriteTopics: signupData.favoriteTopics,
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
                setUserId(response.user.uid);
                return response.user;
            })
            .catch((error) => {
                return { error };
            });
    };

    const handleAuthStateChanged = (newUser) => {
        newUser ? setUserId(newUser.uid) : setUserId('')
    };

    const signOut = () => {
        return auth.signOut().then(() => setUserId(''));
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
        userId,
        signUp,
        signIn,
        signOut,
        sendPasswordResetEmail
    };
};
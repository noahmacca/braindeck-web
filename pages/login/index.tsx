import Link from 'next/link';
import LoginForm from '../../components/LoginForm';
import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";

const LoginPage = () => {
    return (
        <div>
            <PageHead title="BrainDeck Login" />
            <NavBar />
            <div className="min-h-screen flex flex-col bg-gray-200">
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mt-24">
                        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">Log In</h2>
                        <div className="mt-2 text-center text-md text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/signup">
                                <a href="#" className="text-blue-500">Sign Up</a>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
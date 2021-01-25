import Link from 'next/link';
import ResetPasswordForm from '../../components/forms/ResetPasswordForm';
import NavBar from "../../components/NavBar";
import PageHead from "../../components/PageHead";


const ResetPasswordPage: React.FC = () => {
    return (
        <div>
            <PageHead title="BrainDeck Reset Password" />
            <NavBar />
            <div className="min-h-screen flex bg-gray-200">
                <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mt-24">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset password
                        </h2>
                    </div>
                    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <ResetPasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ResetPasswordPage;
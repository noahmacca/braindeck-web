import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import Button from '../Button';

const ResetPasswordForm: React.FC = () => {
    const { register, errors, handleSubmit } = useForm();
    const auth = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSent, setIsSent] = useState(false);

    const onSubmit = (data: { email: string }) => {
        setIsLoading(true);
        setError(null);
        auth.sendPasswordResetEmail(data.email).then(() => {
            setIsSent(true);
            setIsLoading(false);
            setTimeout(() => router.push('/login'), 5000);
        }).catch((err) => {
            setError(err)
        })
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Email address
                </label>
                <div className="mt-1 rounded-md">
                    <input
                        id="email"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                        type="email"
                        name="email"
                        ref={register({
                            required: 'Please enter an email',
                            pattern: {
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Not a valid email',
                            },
                        })}
                    />
                    {errors.email && (
                        <div className="my-2 text-xs text-red-600">
                            {errors.email.message}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <span className="block w-full rounded-md shadow-sm">
                    <Button title="Reset" type="submit" isLoading={isLoading} />
                </span>
            </div>
            {error?.message && (
                <div className="my-4 text-red-500 text-center border-dashed border border-red-600 p-2 rounded">
                    <span>{error.message}</span>
                </div>
            )}
            {isSent && (
                <div className="my-4 text-center border-dashed border p-2 rounded">
                    <span>Sent! Please check your email.</span>
                </div>
            )}
        </form>
    );
};
export default ResetPasswordForm;
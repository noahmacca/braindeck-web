import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth'
import Button from './Button';
import Link from 'next/link';
import { useState } from 'react';

interface LoginData {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const router = useRouter();
    const auth = useAuth();
    const { register, errors, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = (data: LoginData) => {
        setIsLoading(true);
        setError(null);
        return auth.signIn(data).then((response) => {
            setIsLoading(false);
            response.error ? setError(response.error) : router.push('/favorites');
        });
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
                        <div className="mt-2 text-xs text-red-600">
                            {errors.email.message}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1 rounded-md">
                    <input
                        id="password"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                        type="password"
                        name="password"
                        ref={register({
                            required: 'Please enter a password',
                            minLength: {
                                value: 6,
                                message: 'Should have at least 6 characters',
                            },
                        })}
                    />
                    {errors.password && (
                        <div className="mt-2 text-xs text-red-600">
                            {errors.password.message}
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-end">
                    <div className="text-sm leading-5">
                        <Link href="/reset-password">
                            <a
                                href="#"
                                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                            >
                                Forgot your password?
                            </a>
                        </Link>
                    </div>
                </div>

            </div>
            <div className="mt-4">
                <span className="block w-full rounded-md shadow-sm">
                    <Button title="Log In" type="submit" isLoading={isLoading} />
                </span>
            </div>
            {error?.message && (
                <div className="my-4 text-red-500 text-center border-dashed border border-red-600 p-2 rounded">
                    <span>{error.message}</span>
                </div>
            )}
        </form>
    );
};

export default LoginForm;
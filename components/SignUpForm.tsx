import { UserInputSignupData } from '../hooks/types';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Button from './Button';

const SignUpForm: React.FC = () => {
    const auth = useAuth();
    const router = useRouter();
    const { register, errors, handleSubmit, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldShowOtherInput, setShouldShowOtherInput] = useState(false)
    const topicOptions = ['News', 'Finance', 'Technology', 'Product Design', 'Science', 'Mathematics', 'Machine Learning', 'Software Engineering', 'Photography', 'Art']

    const onSubmit = (data) => {
        const favoriteTopics = data.favoriteTopics.filter((i: string) => i !== "Other");
        const userInputSignupData: UserInputSignupData = {
            name: data.name,
            email: data.email,
            password: data.password,
            favoriteTopics: data.favoriteTopicOther ? [...favoriteTopics, data.favoriteTopicOther] : favoriteTopics,
        }


        setIsLoading(true);
        setError(null);
        return auth.signUp(userInputSignupData).then((response) => {
            setIsLoading(false);
            if (response.error) {
                setError(response.error)
            } else {
                reset();
                setShouldShowOtherInput(false);
                router.push('/favorites');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Name
                </label>
                <input
                    id="name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    type="text"
                    name="name"
                    ref={register({
                        required: 'Please enter a name',
                    })}
                />
                {errors.name && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.name.message}
                    </div>
                )}
            </div>
            <div className="mt-6">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Email address
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                    <input
                        id="email"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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
            <div className="mt-6">
                <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                    <input
                        id="password"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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
            </div>
            <div className="mt-6">
                <label
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Favorite Learning Topics (Optional)
                </label>
                {topicOptions.map((topicOption: string) => (
                    <div key={`${topicOption}`} className="mt-1 rounded-md">
                        <label className="inline-flex items-center">
                            <input name="favoriteTopics" type="checkbox" className="form-checkbox border-gray-300" value={`${topicOption}`} ref={register()} />
                            <span className="ml-2 text-gray-700 text-sm">{topicOption}</span>
                        </label>
                    </div>
                ))}
                <div className="mt-1 rounded-md">
                    <label className="inline-flex items-center">
                        <input name="favoriteTopics" value="Other" onClick={() => setShouldShowOtherInput(!shouldShowOtherInput)} type="checkbox" className="form-checkbox border-gray-300" ref={register()} />
                        <span className="ml-2 text-gray-700 text-sm">Other</span>
                    </label>
                </div>
                {
                    shouldShowOtherInput && 
                    <input
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        type="text"
                        name="favoriteTopicOther"
                        ref={register()}
                    />
                }
            </div>
            <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <Button title="Sign Up" type="submit" isLoading={isLoading} />
                </span>
            </div>
            {error?.message && (
                <div className="mb-4 text-red-500 text-center border-dashed border border-red-600 p-2 rounded">
                    <span>{error.message}</span>
                </div>
            )}
        </form>
    );
};
export default SignUpForm;
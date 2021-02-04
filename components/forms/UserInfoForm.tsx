import { UserInfoUpdate } from '../../hooks/types';
import { useForm } from 'react-hook-form';
import { useDb } from '../../hooks/useDb';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';

import Button from '../Button';

const UserInfoForm = ({ dismiss, initialData }: { dismiss: Function, initialData: UserInfoUpdate }) => {
    const db = useDb();
    const router = useRouter();
    const { register, errors, handleSubmit, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const topicOptions = ['News', 'Finance', 'Technology', 'Product Design', 'Science', 'Mathematics', 'Machine Learning', 'Software Engineering', 'Photography', 'Art'];
    const otherTopics = initialData.favoriteTopics?.filter((t) => topicOptions.indexOf(t) === -1)
    const otherTopic = otherTopics.length > 0 ? otherTopics[0] : null; // Only support one "Other" option for now.
    const [shouldShowOtherInput, setShouldShowOtherInput] = useState(otherTopic ? true : false)

    const onSubmit = (data) => {
        console.log('data', data);
        const favoriteTopics = data.favoriteTopics.filter((i: string) => i !== "Other");
        const userInfoUpdate: UserInfoUpdate = {
            uId: initialData.uId,
            name: data.name,
            favoriteTopics: data.favoriteTopicOther ? [...favoriteTopics, data.favoriteTopicOther] : favoriteTopics,
        }

        console.log(userInfoUpdate);

        setIsLoading(true);
        setError(null);
        return db.updateUserInfo(userInfoUpdate).then((response) => {
            setIsLoading(false);
            if (response.error) {
                setError(response.error)
            } else {
                reset();
                dismiss();
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
                    defaultValue={initialData?.name}
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
                    className="block text-sm font-medium leading-5 text-gray-700"
                >
                    Favorite Learning Topics (Optional)
                </label>
                {topicOptions.map((topicOption: string) => (
                    <div key={`${topicOption}`} className="mt-1 rounded-md">
                        <label className="inline-flex items-center">
                            <input
                                name="favoriteTopics"
                                type="checkbox"
                                className="form-checkbox border-gray-300"
                                value={`${topicOption}`}
                                ref={register()}
                                defaultChecked={initialData.favoriteTopics.indexOf(topicOption) > -1}
                            />
                            <span className="ml-2 text-gray-700 text-sm">{topicOption}</span>
                        </label>
                    </div>
                ))}
                <div className="mt-1 rounded-md">
                    <label className="inline-flex items-center">
                        <input
                            name="favoriteTopics"
                            type="checkbox"
                            className="form-checkbox border-gray-300"
                            value="Other"
                            onClick={() => setShouldShowOtherInput(!shouldShowOtherInput)}
                            ref={register()}
                            defaultChecked={shouldShowOtherInput}
                        />
                        <span className="ml-2 text-gray-700 text-sm">Other</span>
                    </label>
                </div>
                {
                    shouldShowOtherInput && 
                    <input
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        defaultValue={otherTopic}
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
export default UserInfoForm;
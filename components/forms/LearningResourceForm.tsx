import { useForm } from 'react-hook-form';
import { useDb } from '../../hooks/useDb';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UserInputLearningResourceData } from '../../hooks/types';

import Button from '../Button';

const LearningResourceForm = ({ dismiss, lpId, lcId, lrId, initialData }: { dismiss: Function, lpId: string, lcId: string, lrId?: string, initialData?: UserInputLearningResourceData }) => {
    const db = useDb();
    const { register, errors, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        setIsLoading(true);
        setError(null);
        const userInputLearningResourceData: UserInputLearningResourceData = {
            title: data.title,
            author: data.author,
            url: data.url,
            format: data.format,
            difficulty: data.format,
            description: data.description,
            highlight: data.highlight,
        }
        if (!lrId) {
            return db.createLearningResource(lpId, lcId, userInputLearningResourceData).then((response) => {
                setIsLoading(false);
                response.error ? setError(response.error) : dismiss();
            })
        } else {
            return db.updateLearningResource(lpId, lcId, lrId, userInputLearningResourceData).then((response) => {
                setIsLoading(false);
                response.error ? setError(response.error) : dismiss();
            })
        }

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    URL
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.url}
                    type="text"
                    name="url"
                    ref={register({
                        required: 'Please enter a url',
                        pattern: {
                            value: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                            message: 'Not a valid url',
                        },
                    })}
                />
                {errors.url && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.url.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Title
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.title}
                    type="text"
                    name="title"
                    ref={register({
                        required: 'Please enter a title',
                    })}
                />
                {errors.title && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.title.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Author
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.author}
                    type="text"
                    name="author"
                    ref={register({
                        required: 'Please enter an author',
                    })}
                />
                {errors.author && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.author.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Format
                </label>
                <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.format}
                    name="format"
                    ref={register({
                        required: 'Please select a format',
                    })}
                >
                    <option value="ARTICLE">Article</option>
                    <option value="TWEET">Tweet</option>
                    <option value="BOOK">Book</option>
                    <option value="VIDEO">Video</option>
                    <option value="PODCAST">Podcast</option>
                    <option value="COURSE">Course</option>
                    <option value="OTHER">Other</option>
                </select>
                {errors.format && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.format.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Difficulty
                </label>
                <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.difficulty}
                    name="difficulty"
                    ref={register({
                        required: 'Please select a difficulty',
                    })}
                >
                    <option value="EASY">Easy</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HARD">Hard</option>
                    <option value="ADVANCED">Advanced</option>
                </select>
                {errors.difficulty && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.difficulty.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Description (optional)
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.description}
                    type="text"
                    name="description"
                    ref={register()}
                />
                {errors.description && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.description.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Highlight (optional)
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.highlight}
                    type="text"
                    name="highlight"
                    ref={register()}
                />
                {errors.highlight && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.highlight.message}
                    </div>
                )}
            </div>
            <div>
                <span className="block w-full rounded-md shadow-sm mt-6">
                    <Button title="Submit" type="submit" isLoading={isLoading} />
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
export default LearningResourceForm;
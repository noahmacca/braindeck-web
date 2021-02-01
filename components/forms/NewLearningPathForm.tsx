import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Button from '../Button';

const NewLearningPathForm: React.FC = () => {
    const auth = useAuth();
    const router = useRouter();
    const { register, errors, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        console.log('onSubmit', data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    URL
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
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
                    Subject
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    type="text"
                    name="subject"
                    ref={register({
                        required: 'Please enter a subject',
                    })}
                />
                {errors.subject && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.subject.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Learning Goal
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    type="text"
                    name="learningGoal"
                    ref={register({
                        required: 'Please enter a learning goal',
                    })}
                />
                {errors.learningGoal && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.learningGoal.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Background Knowledge
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    type="text"
                    name="background"
                    ref={register({
                        required: 'Please enter suggested background knowledge',
                    })}
                />
                {errors.background && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.background.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Duration
                </label>
                <select name="duration" ref={register} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                    <option value="Quick (<1 Hr)">Quick (&lt;1 Hr)</option>
                    <option value="Fast (1-2 Hr)">Fast (1-2 Hr)</option>
                    <option value="Medium (2-5 Hr)">Medium (2-5 Hr)</option>
                    <option value="Long (5-10 Hr)">Long (5-10 Hr)</option>
                    <option value="Very Long (>10 Hr)">Very Long (&gt;10 hr)</option>
                </select>
                {errors.duration && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.duration.message}
                    </div>
                )}
            </div>
            <div className="rounded-md shadow-sm mb-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">
                    Difficulty
                </label>
                <select name="estDifficulty" ref={register} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Advanced">Advanced</option>
                </select>
                {errors.estDifficulty && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.estDifficulty.message}
                    </div>
                )}
            </div>
            <div>
                <span className="block w-full rounded-md shadow-sm mt-3">
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
export default NewLearningPathForm;
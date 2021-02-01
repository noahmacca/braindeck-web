import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useDb } from '../../hooks/useDb';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UserInputLearningPathData } from '../../hooks/types';

import Button from '../Button';

const LearningPathForm = ({ dismiss, initialData, lpId }: { dismiss: Function, initialData?: UserInputLearningPathData, lpId?: string }) => {
    const db = useDb();
    const { register, errors, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        setIsLoading(true);
        setError(null);
        const userInputLearningPathData: UserInputLearningPathData = {
            title: data.title,
            subject: data.subject,
            learningGoal: data.learningGoal,
            background: data.background,
            difficulty: data.difficulty,
            duration: data.duration,
        }
        if (!lpId) {
            return db.createLearningPath(userInputLearningPathData).then((response) => {
                setIsLoading(false);
                response.error ? setError(null) : dismiss();
            })
        } else {
            return db.updateLearningPath(lpId, userInputLearningPathData).then((response) => {
                setIsLoading(false);
                response.error ? setError(null) : dismiss();
            })
        }

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    Subject
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.subject}
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
                    defaultValue={initialData?.learningGoal}
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
                    defaultValue={initialData?.background}
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
                <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.duration}
                    name="duration"
                    ref={register}
                >
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
                <select
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.difficulty}
                    name="difficulty"
                    ref={register}
                >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                    <option value="Advanced">Advanced</option>
                </select>
                {errors.difficulty && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.difficulty.message}
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
export default LearningPathForm;
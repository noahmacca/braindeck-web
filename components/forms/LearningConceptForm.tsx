import { useForm } from 'react-hook-form';
import { useDb } from '../../hooks/useDb';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { UserInputLearningConceptData } from '../../hooks/types';

import Button from '../Button';

const LearningConceptForm = ({ dismiss, lpId, initialData, lcId }: { dismiss: Function, lpId: string, initialData?: UserInputLearningConceptData, lcId?: string }) => {
    const db = useDb();
    const { register, errors, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = (data) => {
        setIsLoading(true);
        setError(null);
        const userInputLearningConceptData: UserInputLearningConceptData = {
            title: data.title,
            description: data.description,
        }
        if (!lcId) {
            return db.createLearningConcept(lpId, userInputLearningConceptData).then((response) => {
                setIsLoading(false);
                response.error ? setError(response.error) : dismiss();
            })
        } else {
            return db.updateLearningConcept(lpId, lcId, userInputLearningConceptData).then((response) => {
                setIsLoading(false);
                response.error ? setError(response.error) : dismiss();
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
                    Description
                </label>
                <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                    defaultValue={initialData?.description}
                    type="text"
                    name="description"
                    ref={register({
                        required: 'Please enter a description',
                    })}
                />
                {errors.description && (
                    <div className="mt-2 text-xs text-red-600">
                        {errors.description.message}
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
export default LearningConceptForm;
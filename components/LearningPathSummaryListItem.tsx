import Link from 'next/link'
import { HeartFill, Heart, Trash, PencilSquare, ClockFill, BarChartFill, CalendarCheckFill, LightningFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import { LearningPathUser } from '../hooks/types';
import { useDb } from '../hooks/useDb';
import LearningPathForm from './forms/LearningPathForm';
import FormModal from '../components/forms/FormModal';
import ConfirmationForm from './forms/ConfirmationForm';
import StarRating from './StarRating';

export default function LearningPathSummaryListItem({ lp }: { lp: LearningPathUser }) {
    const [shouldShowEditModal, setShouldShowEditModal] = useState(false);
    const [shouldShowConfirmDeleteModal, setShouldShowConfirmDeleteModal] = useState(false);
    const learningPath = lp.data;
    const db = useDb();
    const setLpFavorite = (isFavorite: boolean) => db.setLpFavorite({
        isFavorite,
        lpId: lp.id,
        uId: db.user.uid,
    })

    const setLpRating = (rating: number) => db.setLpRating({
        rating,
        lpId: lp.id,
        uId: db.user.uid
    });

    return (
        <div>
            <div className="bg-gray-50 rounded-lg">
                <div className="max-w-6xl mb-6 mx-auto">
                    <div className="md:grid md:grid-cols-3 md:divide-x-2 gap-4">
                        <div className="col-span-2 p-3 md:p-5 items-center text-gray-600">
                            <div>
                                <Link href={`/learn/${lp.id}`}>
                                    <div className="text-3xl pb-1 font-semibold tracking-tight text-gray-700 cursor-pointer">{learningPath.title}</div>
                                </Link>
                            </div>
                            <div className="">
                                <div className="text-md pb-1 font-light flex items-center">
                                    {lp.data.author.name} {lp.userData.isCreator === true ? '(You)' : undefined}
                                    {
                                        lp.userData.isCreator === true ?
                                            <div className="flex bg-gray-100 p-2 px-3 ml-4 rounded items-center">
                                                <PencilSquare className="mr-4 cursor-pointer text-gray-600 hover:text-gray-400" size={16} onClick={() => setShouldShowEditModal(true)} />
                                                <Trash className="cursor-pointer text-gray-600 hover:text-gray-400" size={16} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                                            </div>
                                            : undefined
                                    }
                                </div>
                                <div className="flex flex-wrap text-md text-gray-700">
                                    <span className="flex pr-1 md:pr-3">
                                        <StarRating
                                            size={16}
                                            numStars={Math.round(lp.data.avgRating)}
                                            isClickable={lp.userData.progress === 1.0}
                                            cb={(numStars: number) => { setLpRating(numStars) }}
                                        />
                                        <span className="pl-3 text-lg text-yellow-400">{Math.round(lp.data.avgRating * 10) / 10}</span>
                                        <span className="pl-3 text-md my-auto">{lp.data.countReviews} rating{lp.data.countReviews === 1 ? '' : 's'}</span>
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <div className="text-sm pb-1 font-medium">In this learning path, you will</div>
                                    <div className="text-sm font-light">{lp.data.learningGoal}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 text-sm m-3 md:my-7">
                            <div className="text-gray-700 px-6 pb-6 md:pb-0 md:px-12">
                                <div className="mb-2 flex items-center">
                                    <ClockFill className="mr-2 text-indigo-900" size={16} />
                                    <span className="font-light">{lp.data.duration}</span>
                                </div>
                                <div className="mb-4 flex items-center">
                                    <BarChartFill className="mr-2 text-indigo-900" size={16} />
                                    <span className="font-light">{lp.data.difficulty}</span>
                                </div>
                                <hr className="mx-4" />
                                <div className="font-medium my-4">Resources{' '}
                                    <div className="font-light">
                                        {
                                            Object.keys(lp.userData.countByResourceFormat).length !== 0 ?
                                                Object.keys(lp.userData.countByResourceFormat).map((format) => {
                                                    const count = lp.userData.countByResourceFormat[format];
                                                    return (
                                                        <div className="mt-2 capitalize" key={`${format}`}>
                                                            <span className="font-bold text-indigo-900">{count}</span> {format.toLowerCase()}{count !== 1 ? 's' : ''}
                                                        </div>
                                                    )
                                                })
                                                :
                                                <div className="mt-2 capitalize">
                                                    None
                                                </div>
                                        }
                                    </div>
                                </div>
                                {
                                    (lp.userData.isFavorite || lp.userData.progress > 0.0) &&
                                    <div>
                                        <hr className="mx-4" />
                                        <div className="mt-4 flex items-center">
                                            <LightningFill className="mr-2 text-indigo-900" size={16} />
                                            <span className="font-light">{Math.round(lp.userData.progress * 100)}% complete</span>
                                        </div>
                                        {
                                            lp.userData.isFavorite &&
                                            <div className="mt-4 flex items-center">
                                                <HeartFill className="mr-2 text-indigo-900" size={16} />
                                                <span className="font-light">Favorited</span>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <FormModal
                    title="Edit Learning Path"
                    shouldShowModal={shouldShowEditModal}
                    dismissModal={() => setShouldShowEditModal(false)}
                >
                    <LearningPathForm
                        dismiss={() => setShouldShowEditModal(false)}
                        initialData={{
                            title: lp.data.title,
                            subject: lp.data.subject,
                            learningGoal: lp.data.learningGoal,
                            background: lp.data.background,
                            difficulty: lp.data.difficulty,
                            duration: lp.data.duration
                        }}
                        lpId={lp.id}
                    />
                </FormModal>
                <FormModal
                    title="Delete Learning Path?"
                    shouldShowModal={shouldShowConfirmDeleteModal}
                    dismissModal={() => setShouldShowConfirmDeleteModal(false)}
                >
                    <ConfirmationForm
                        info={lp.data.title}
                        dismissAction={() => setShouldShowConfirmDeleteModal(false)}
                        confirmAction={() => {
                            db.deleteLearningPath(lp.id);
                            setShouldShowConfirmDeleteModal(false);
                        }}
                    />
                </FormModal>
            </div>
        </div>
    )
}
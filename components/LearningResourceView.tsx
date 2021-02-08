import { CheckSquareFill } from 'react-bootstrap-icons';
import { LearningPathUser, LearningConcept, LearningResource } from '../hooks/types';
import { useEffect, useState } from 'react';
import { useDb } from '../hooks/useDb';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import LearningResourceForm from './forms/LearningResourceForm';
import FormModal from './forms/FormModal';
import ConfirmationForm from './forms/ConfirmationForm';
import Link from 'next/link'

export default function LearningResourceView({ lp, lc, lr }: { lp: LearningPathUser, lc: LearningConcept, lr: LearningResource }) {
    const [shouldShowLrEditModal, setShouldShowLrEditModal] = useState(false);
    const [shouldShowConfirmDeleteModal, setShouldShowConfirmDeleteModal] = useState(false);
    const [ogImgUrl, setOgImgUrl] = useState(null);
    const [ogTitle, setOgTitle] = useState(null);
    const [ogType, setOgType] = useState(null);
    const [ogDescription, setOgDescription] = useState(null);
    const [ogSiteName, setOgSiteName] = useState(null);
    const db = useDb();
    const isComplete = db.user?.learningResources?.some(uLr => (uLr.id === lr.id) && !!uLr.isCompleted);
    const setLearningResourceComplete = (lrId: string, isComplete: boolean) => {
        db.setLearningResourceComplete({
            uId: db.user.uid,
            lrId,
            isComplete
        });
    }

    const parseOgImage = (ogImage) => {
        let imgUrl: string = '';
        if (Array.isArray(ogImage)) {
            // loop through and take the first with width above 300px
            for (let i = 0; i < ogImage.length; i++) {
                const w = parseInt(ogImage[i].width, 10);
                if (w > 300) {
                    imgUrl = ogImage[i].url
                    break;
                }
            }
        } else {
            // else there's only one item, which is string
            imgUrl = ogImage.url;
        }
        return imgUrl
    }

    const extractHostName = (url: string) => {
        let hostname = '';
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }

    useEffect(() => {
        fetch(`/api/getOgData/?url=${lr.url}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if (data.ogImage) {
                    const imgUrl = parseOgImage(data.ogImage);
                    setOgImgUrl(imgUrl);
                }
                setOgTitle(data.ogTitle)
                setOgType(data.ogType)
                setOgDescription(data.ogDescription)
                const siteName = data.ogSiteName ? data.ogSiteName : extractHostName(lr.url);
                setOgSiteName(siteName);
            })
            .catch((err) => {
                console.log('err', err);
            })
    }, []);

    return (
        <div className="md:mx-3 mb-2">
            <div className=" w-full lg:max-w-full lg:flex">
                <div className="h-48 lg:h-auto lg:w-48 flex-none border-r border-t border-l border-gray-400 lg:border-r-0 lg:border-b lg:border-gray-400 bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style={{ backgroundImage: `url(${ogImgUrl})` }} title="PreviewImg">
                </div>
                <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-2">
                        {
                            lp.userData.isCreator === true ?
                                <span>
                                    <Trash className="mr-5 mt-2 float-right cursor-pointer text-gray-400 hover:text-gray-600" size={18} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                                    <PencilSquare className="mr-5 mt-2 float-right cursor-pointer text-gray-400 hover:text-gray-600" size={18} onClick={() => setShouldShowLrEditModal(true)} />
                                </span>
                                : undefined
                        }
                        <div className="text-gray-900 font-semibold text-xl mb-1">
                            <a href={`${lr.url}`} target="_blank">{`${ogTitle}`}</a>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                            {ogSiteName}{' • '}<span className="capitalize">{lr.format.toLowerCase()}</span>{' • '}<span className="capitalize">{lr.difficulty.toLowerCase()}</span>
                        </div>
                        {
                            ogDescription &&
                            <div className="text-gray-700 mb-2">
                                <div className="font-medium">Description</div>
                                <div className="font-light">{ogDescription}</div>
                            </div>
                        }
                        {
                            lr.highlight &&
                            <div className="text-gray-700 mb-2">
                                <div className="font-medium">Highlight</div>
                                <div className="font-light">{lr.highlight}</div>
                            </div>
                        }
                        {
                            db.user ?
                                !isComplete ?
                                    <div className="rounded-md border p-2 mt-4 flex w-28 text-gray-700 hover:bg-green-50 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, true)}>
                                        <div className="mx-auto flex">
                                            <span className="text-sm">Complete</span>
                                        </div>
                                    </div> :
                                    <div className="rounded-md border border-green-100 p-2 mt-4 flex w-28 text-gray-700 bg-green-50 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, false)}>
                                        <div className="mx-auto flex">
                                            <span className="text-sm">Completed</span>
                                            <CheckSquareFill className="ml-2 text-green-500" size={20} />
                                        </div>
                                    </div>
                                :
                                <Link href="/login">
                                    <div className="rounded-md border p-2 mt-4 flex w-28 text-gray-700 hover:bg-green-50 cursor-pointer">
                                        <div className="mx-auto flex">
                                            <span className="text-sm">Complete</span>
                                        </div>
                                    </div>
                                </Link>
                        }
                    </div>
                </div>
            </div>
            <FormModal
                title="Edit Resource"
                shouldShowModal={shouldShowLrEditModal}
                dismissModal={() => setShouldShowLrEditModal(false)}
            >
                <LearningResourceForm
                    dismiss={() => setShouldShowLrEditModal(false)}
                    lpId={lp.id}
                    lcId={lc.id}
                    lrId={lr.id}
                    initialData={{
                        title: lr.title,
                        author: lr.author,
                        url: lr.url,
                        format: lr.format,
                        difficulty: lr.difficulty,
                        description: lr.description,
                        highlight: lr.highlight,
                    }}
                />
            </FormModal>
            <FormModal
                title="Delete Resource?"
                shouldShowModal={shouldShowConfirmDeleteModal}
                dismissModal={() => setShouldShowConfirmDeleteModal(false)}
            >
                <ConfirmationForm
                    info={lr.title}
                    dismissAction={() => setShouldShowConfirmDeleteModal(false)}
                    confirmAction={() => db.deleteLearningResource(lp.id, lc.id, lr.id)}
                />
            </FormModal>
        </div>
    )
}
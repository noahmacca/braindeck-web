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
            // loop through and take any with width above 300px, else the first
            imgUrl = ogImage[0].url
            ogImage.forEach((img) => {
                const w = parseInt(img.width, 10);
                if (w > 300) {
                    imgUrl = img.url
                }
            });
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
        // console.log('lrResourceView load', lr.url);
        fetch(`/api/getOgData/?url=${lr.url}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
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
        <div className="p-3 md:mx-3 bg-white mb-2 rounded-lg">
            {
                lp.userData.isCreator === true ?
                    <span>
                        <Trash className="mr-5 mt-2 cursor-pointer float-right text-gray-400 hover:text-gray-600" size={16} onClick={() => setShouldShowConfirmDeleteModal(true)} />
                        <PencilSquare className="mr-5 mt-2 cursor-pointer float-right text-gray-400 hover:text-gray-600" size={16} onClick={() => setShouldShowLrEditModal(true)} />
                    </span>
                    : undefined
            }
            <img src={ogImgUrl} />
            <div>{ogTitle}</div>
            <div>{ogType}</div>
            <div>{ogDescription}</div>
            <div>{ogSiteName}</div>
            <div className="text-xl mb-2">
                <a href={`${lr.url}`} target="_blank">{`${ogTitle}`}</a>
            </div>
            <div className="text-sm mb-4">
                {ogSiteName}{' '}
                <span className="capitalize ml-2 bg-gray-100 text-gray-600 rounded-md px-2 py-1">
                    {lr.format.toLowerCase()}
                </span>{' '}
                <span className="capitalize bg-gray-100 text-gray-600 rounded-md px-2 py-1 ml-2">
                    {lr.difficulty.toLowerCase()}
                </span>
            </div>
            <div className="pb-2">
                {lr.description && <div className="text-sm font-medium">Description <span className="font-light">{ogDescription}</span></div>}
                {lr.highlight && <div className="text-sm mt-1 font-medium">Highlight <span className="font-light">{lr.highlight}</span></div>}
            </div>
            <div>
                {
                    db.user ?
                        !isComplete ?
                            <div className="rounded-md border p-1 mt-1 flex w-28 text-gray-700 hover:bg-green-50 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, true)}>
                                <div className="mx-auto flex">
                                    <span className="text-sm">Complete</span>
                                </div>
                            </div> :
                            <div className="rounded-md border border-green-100 p-1 mt-1 flex w-28 text-gray-700 bg-green-50 cursor-pointer" onClick={() => setLearningResourceComplete(lr.id, false)}>
                                <div className="mx-auto flex">
                                    <span className="text-sm">Completed</span>
                                    <CheckSquareFill className="ml-2 text-green-500" size={20} />
                                </div>
                            </div>
                        :
                        <Link href="/login">
                            <div className="rounded-md border p-1 mt-1 flex w-28 text-gray-700 hover:bg-green-50 cursor-pointer">
                                <div className="mx-auto flex">
                                    <span className="text-sm">Complete</span>
                                </div>
                            </div>
                        </Link>
                }
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
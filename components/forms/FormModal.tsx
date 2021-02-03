
import { useEffect } from 'react';

export default function FormModal({ title, shouldShowModal, dismissModal, children }) {
    const _handleKeyDown = (event) => {
        switch (event.keyCode) {
            case 27: // ESCAPE_KEY
                dismissModal();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", _handleKeyDown);
        return document.removeEventListener("keydown", (e) => _handleKeyDown(e));
    }, []);

    return (
        <div className={`modal fixed w-full h-full top-0 left-0 flex items-center justify-center transition-opacity ease-in-out ${shouldShowModal ? null : 'opacity-0 pointer-events-none'}`}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">{title}</p>
                        <div className="modal-close cursor-pointer z-50" onClick={() => dismissModal()}>
                            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
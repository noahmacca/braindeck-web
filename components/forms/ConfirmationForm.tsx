const ConfirmationForm = ({ info, dismissAction, confirmAction }: { info: string, dismissAction: Function, confirmAction: Function }) => {
    return (
        <div>
            <div className="italic text-gray-500 mb-2">
                {info}
            </div>
            <div className="flex text-center">
                <div className="flex-1 p-3 m-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => dismissAction()}>
                    Cancel
                    </div>
                <div className="flex-1 p-3 m-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={() => confirmAction()}>
                    Delete
                    </div>
            </div>
        </div>
    )
}

export default ConfirmationForm;
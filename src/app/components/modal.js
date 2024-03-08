function Modal ({ isOpen, onClose, title, children} ) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 text-white rounded-lg max-w-sm w-full p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={onClose} className="text-lg">&times;</button>
            </div>
            <div className="mt-4">
                {children}
            </div>
            </div>
        </div>
    )
}

function ToggleModalButton ({ label, onClick }) {
    return (
        <button
            className="px-4 py-2 bg-white rounded hover:bg-grey-200 transition-colors text-black font-bold"
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export { Modal, ToggleModalButton }
// Popup modal
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

// Toggle button to open and close the modal
function ToggleModalButton ({ label, onClick }) {
    return (
        <button
            className="px-2 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-600"
            onClick={onClick}
        >
            {label}
        </button>
    )
}

export { Modal, ToggleModalButton }
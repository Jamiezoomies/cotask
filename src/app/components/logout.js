import { handleLogout } from '../utils/actions'

function LogoutButton() {
    return (
        <button 
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogout()}>
            Logout
        </button>
    )
}

export default LogoutButton;
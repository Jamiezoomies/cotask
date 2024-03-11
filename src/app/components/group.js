'use client'
import { useState, useEffect, useRef } from "react"
import { createGroup } from "../lib/actions"
import { Modal, ToggleModalButton } from "../components/modal"
import { Message } from "./message"
import QRCode from 'qrcode'

function GroupList({ groups }) {
    return (
        <div className="bg-gray-900 w-48 text-white p-4">
            <h2>Group Channels</h2>
            <GroupCreationModal/>
            <ul className="flex flex-col">
                {groups?.map(group => (
                    <li 
                        key={group.id} 
                        className="flex items-center bg-gray-800 py-2 hover:bg-gray-700 my-2 border-b border-gray-600 p-2 cursor-pointer"
                    >
                        <a className="w-full" href={`/group/${group.join_url}`}>
                            <div className="flex flex-col flex-grow items-center gap-1">
                                <span className="text-base font-medium">{group.name}</span>
                                <span className="text-sm text-gray-400">{group.description}</span>
                                <span className="text-xs border border-purple-400 text-purple-400 bg-purple-900 p-1 rounded-lg">{group.join_url}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function GroupCreation() {
    const [response, setResponse] = useState(null)
    
    async function create (formData) {
        setResponse(await createGroup(formData))
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-1/2 bg-gray-100">
                <Message isError={!response?.ok} text={response?.msg}/>
                <form action={create} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Create a Group Channel</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Group Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            name="name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Group Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                            name="description"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Create Group
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

function GroupCreationModal() {
    const [isModalOpen, setModalOpen] = useState(false)

    function toggleModal () {
        setModalOpen(!isModalOpen)
    }

    return (
        <>
            <ToggleModalButton label="Create a group" onClick={toggleModal} />
            <Modal isOpen={isModalOpen} onClose={toggleModal} title="Create a group">
                <GroupCreation/>
            </Modal>
        </>
    )
}

function GroupDetailsModal({ pageUrl, group }) {
    const [isModalOpen, setModalOpen] = useState(false)
    function toggleModal () {
        setModalOpen(!isModalOpen)
    }

    return (
        <>
            <ToggleModalButton label="Share" onClick={toggleModal} />
            <Modal isOpen={isModalOpen} onClose={toggleModal} title={group?.name}>
                <GroupDetails pageUrl={pageUrl} group={group}/>
            </Modal>
        </> 
    )
}

function GroupDetails({ pageUrl, group }) {
    const url = `${pageUrl}/group/${group?.join_url}/join`
    return (
        <>
            <p>{ group?.description }</p>
            <p>{ group?.created_at }</p>
            <p>{url}</p>
            <QRCodeComponent url={url}/>
        </>
    )
}

function QRCodeComponent({ url }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, (error) => {
            if (error) console.error('Error generating QR code: ', error);
        });
        }
    }, [url]); // Regenerate the QR code if the URL changes

    return <canvas ref={canvasRef} />;
}



export { GroupList, GroupCreation, GroupCreationModal, GroupDetailsModal, GroupDetails}
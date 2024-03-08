'use client'
import { useState, useEffect, useRef } from "react"
import { getGroups, createGroup, joinGroup } from "../lib/actions"
import { Modal, ToggleModalButton } from "../components/modal"
import { Message } from "./message"
import QRCode from 'qrcode'

function GroupList({ groups }) {
    const [response, setResponse] = useState()
    
    return (
        <div className="bg-gray-900 w-64 text-white p-4">
            <div className="py-4">
                <p className="text-sm">{response?.msg}</p>
            </div>
            <GroupCreationModal/>
            <ul className="flex flex-col">
                {groups?.map(group => (
                    <li 
                        key={group.id} 
                        className="flex items-center py-2 hover:bg-gray-700 cursor-pointer"
                    >
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <a href={`/group/${group.join_url}`}>
                            <div className="flex flex-col flex-grow">
                                <span className="text-sm font-medium">{group.name}</span>
                                <span className="text-xs text-gray-400">{group.description}</span>
                                <span className="text-xs">{group.join_url}</span>
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

function GroupDetailsModal({ group }) {
    const [isModalOpen, setModalOpen] = useState(false)
    function toggleModal () {
        setModalOpen(!isModalOpen)
    }

    return (
        <>
            <ToggleModalButton label="Group Channel Info" onClick={toggleModal} />
            <Modal isOpen={isModalOpen} onClose={toggleModal} title={group?.name}>
                <GroupDetails group= { group }/>
            </Modal>
        </> 
    )
}

function GroupDetails({ group }) {
    return (
        <>
            <p>{ group?.description }</p>
            <p>{ group?.created_at }</p>
            <p>{ group?.join_url }</p>
            <QRCodeComponent url={ group?.join_url }/>
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

function JoinGroupButton(code) {
    
    async function join() {
        const response = await joinGroup(code)
    }
    return (
        <button className="bg-purple-400 hover:bg-purple-600 text-white rounded p-4 shadow-md" onClick={ join }>Join Group</button>
    )
}


export { GroupList, GroupCreation, GroupCreationModal, GroupDetailsModal, GroupDetails, JoinGroupButton}
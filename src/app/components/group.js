'use client'
import { useState, useEffect, useRef } from "react"
import { createGroup, getBaseUrl, getGroups } from "../lib/actions"
import { Modal, ToggleModalButton } from "../components/modal"
import { Loading, Message } from "./utils"
import QRCode from 'qrcode'

function GroupList({ channel }) {
    const [isLoading, setLoading] = useState(true)
    const [isOpenCreation, setOpenCreation] = useState(false)
    const [groups, setGroups] = useState()

    useEffect(()=> {
        (async()=>{
            const response = await getGroups(channel)
            setGroups(response?.data)
            if (response) {
                setLoading(false)
            }
        })()
    }, [])

    useEffect(()=> {
        (async()=>{
            if (!isOpenCreation) {
                setLoading(true)
                const response = await getGroups(channel)
                setGroups(response?.data)
                if (response) {
                    setLoading(false)
                }
            }
        })()
    }, [isOpenCreation])
    
    return (
        <>
        <Modal isOpen={isOpenCreation} onClose={()=>setOpenCreation(false)} title="New Group">
            <GroupCreation/>
        </Modal>
        <div className="bg-gray-900 w-48 text-white p-2">
            <h2 className="p-2 text-center font-semibold">Group Channels</h2>
            <button className="text-sm bg-gray-500 py-2 w-full rounded-lg hover:bg-gray-400 shadow-md" onClick={()=>setOpenCreation(true)}>Create a Group</button>
            <ul className="flex flex-col">
            { isLoading && <Loading/>}
                {groups?.map(group => (
                    <li 
                        key={group.id} 
                        className="flex items-center bg-gray-800 py-2 hover:bg-gray-700 rounded-lg my-1 shadow-lg border-b border-gray-600 p-2 cursor-pointer"
                    >
                        <a className="w-full" href={`/group/${group.join_url}`}>
                            <div className="flex flex-col flex-grow items-center gap-1">
                                <span className="text-base font-sm">{group.name}</span>
                                <span className="text-sm text-gray-400">{group.description}</span>
                                <span className="text-xs mt-2 border border-purple-500 text-purple-500 bg-indigo-900 p-1 rounded-md shadow-lg">{group.join_url}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

function GroupOverview({ group }) {
    return (
        <>
        <h1 className="font-medium text-2xl py-4 px-1">Group Channel</h1>
        <div className="flex bg-blue-100 flex-col p-4 bg-white rounded-lg shadow-md shadow-lg border border-gray-300">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-900">Name</label>
                    <p className="text-xl font-semibold text-gray-800">{group?.data?.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900">Description</label>
                    <p className="text-gray-800 mt-1">{group?.data?.description}</p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-900">Join Code</label>
                    <p className="text-sm text-gray-800 mt-1">Code: <span className="font-medium text-gray-700">{group?.data?.join_url}</span></p>
                </div>
                <GroupDetailsModal group={group?.data} />
                </div>
            </div>
        </>
    )
}

function GroupCreation() {
    const [createdGroup, setCreatedGroup] = useState(null)
    
    async function create (formData) {
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
        }

        const response = await createGroup(data)
        setCreatedGroup(response)
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-1/2 bg-gray-100">
                <Message isError={!createdGroup?.ok} text={createdGroup?.msg}/>
                {!createdGroup &&
                (
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
                ) 
                }      
            </div>
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
            <ToggleModalButton label="Share" onClick={toggleModal} />
            <Modal isOpen={isModalOpen} onClose={toggleModal} title={group?.name}>
                <GroupDetails group={group}/>
            </Modal>
        </> 
    )
}

function GroupDetails({ group }) {
    const url = `${window.location.origin}/group/${group?.join_url}/join`
    return (
        <div className="space-y-4 bg-white p-5 rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Channel</label>
                <p className="mt-1 text-sm text-gray-500">{group?.name}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-500">{group?.description}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Created At</label>
                <p className="mt-1 text-sm text-gray-500">{group?.created_at.slice(0, 10)}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Link</label>
                <p className="mt-1 text-sm text-blue-500 break-words">{url}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">QR Code</label>
                <div className="mt-1">
                <QRCodeComponent url={url} />
                </div>
            </div>
        </div>
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



export { GroupList, GroupOverview, GroupCreation, GroupDetailsModal, GroupDetails}
'use client'
import { createComment, getComments } from "../lib/actions"
import { useState } from "react"

function CommentsList({ comments, onSearch }) {
    return (
        <>
            <div className="flex flex-row items-end justify-between">
                <h1 className="font-medium text-2xl py-4 px-1">Comment</h1>
                <SearchComment onSearch={onSearch}/>
            </div>
            <ul className="flex flex-col gap-3 p-4 bg-white shadow-lg rounded-lg">
            {comments?.map(comment => (
                <li 
                key={comment.id} 
                className="flex gap-4 items-start border border-gray-100 px-4 py-1 rounded-lg bg-gray-100 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ease-in-out"
                >
                <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{comment.username}</span>
                    <span className="text-xs text-gray-500">{comment.created_at.slice(0, 10)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
                </div>
                </li>
            ))}
            </ul>
        </>
    )
}

function SendComment({channel, onUpdate}) {

    async function send (formData) {
        const data = {
            code: channel,
            text: formData.get('text')
        }

        const response = await createComment(data)
        if (response?.ok) {
            onUpdate()
        }
    }

    return (
        <form action={send} className="flex gap-1 py-1 mb-5">
          <input
            type="text"
            name="text"
            placeholder="Enter your comment..."
            className="flex-grow p-2 border rounded shadow focus:outline-none rounded-lg"
          />
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600">
            Post
          </button>
        </form>
    )
        
}

function SearchComment({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    async function handleSearch(event) {
        const query = event.target.value;
        setInputValue(query);
        onSearch(query)
    }

    return (
        <div className="flex gap-1 py-1">
            <input
                type="text"
                name="text"
                value={inputValue}
                onChange={handleSearch}
                placeholder="Search Comment..."
                className="flex-grow p-2 border border-gray-300 rounded shadow focus:outline-none rounded-lg"
            />
        </div>
    )
}
export { CommentsList, SendComment, SearchComment }
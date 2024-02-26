function Message ({isError, text}) {
    if (!text) return null
    return (
        <div className={`${isError?'bg-red-200 text-red-700':'bg-blue-200 text-blue-700'} font-semibold max-w-sm shadow-md px-8 pt-6 pb-8 mb-4 rounded overflow-hidden`}>
            <p>{isError?'Error: ':''}{ text }</p>
        </div>
    )
}

export { Message }
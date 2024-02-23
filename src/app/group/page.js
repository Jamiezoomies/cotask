import { getGroups } from "../lib/actions"
import { Message } from "../components/message"
export default async function GroupPage() {
    const response = await getGroups()
    
    return (
        <>
            <Message isError={ !response.ok } text={ response?.msg }/>
            <ul>
                {response?.data?.map(group => 
                    <li key={group.id}>{group.name} {group.description} {group.join_url} {group.created_at}</li>
                )}
            </ul>
        </>
    )
}



import { GroupList } from "../../components/group"

export default function GroupPage({ params }) {
    
    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex p-4">
                    {params.code}
                </div>
            </div>
        </>
    )
}


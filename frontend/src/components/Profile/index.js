import "./index.css"
import { useState, useEffect } from "react"
import axios from "axios"

const Profile = () => {
    const token = localStorage.getItem("token")
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fecthProfile = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/profile/", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setProfile(res.data)
                console.log(res.data)

            }
            catch (err) {
                console.log(err)

            }
        }

        fecthProfile()
    }, [token])

    return (
        <>
            {profile ? (
                <div className="Profile-card">
                    <div>
                        <h1>userId : {profile.id}</h1>
                        <h3>username : {profile.username}</h3>
                        <p>FirstName : {profile.first_name}</p>
                        <p>LastName : {profile.last_name}</p>
                        <p>Email : {profile.email}</p>

                    </div>
                </div>
            ) : (<p>Profile Loading....</p>)}
        </>
    )
}
export default Profile 

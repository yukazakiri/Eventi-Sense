import Profile from "../components/Profile/mainProfile"
import MainFooter from "../layout/MainFooter"
import MainNavbar from '../layout/components/MainNavbar'


function ProfilePage() {
  return (
    <div>
        <MainNavbar />
        <div className="min-h-screen bg-gray-800">
            <Profile />
        </div>
    
        <MainFooter />

    </div>
  )
}

export default ProfilePage
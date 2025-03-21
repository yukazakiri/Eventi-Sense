import Profile from "../components/Profile/profile"
import MainFooter from "../layout/MainFooter"
import MainNavbar from '../layout/components/MainNavbar'


function ProfilePage() {
  return (
    <div>
        <MainNavbar />
        <div className="min-h-screen bg-gray-100 py-8 mt-[4rem]">
            <Profile />
        </div>
    
        <MainFooter />

    </div>
  )
}

export default ProfilePage
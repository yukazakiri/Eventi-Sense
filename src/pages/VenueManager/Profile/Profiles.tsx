
import Profile from './Profile'
import Company from './Company'

function Profiles() {
  return (
    <div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mx-8 my-4 '>
        <h1 className="text-3xl font-bold font-bonanova text-gray-700  ">Profile</h1>
            <Profile />
        </div>
        <div className='bg-white p-4 border-[1px] border-gray-300 rounded-3xl mx-8 my-4 '>
        <h1 className="text-3xl font-bold font-bonanova text-gray-700  ">Company</h1>
            <Company />
        </div>
        
      
    </div>
  )
}

export default Profiles
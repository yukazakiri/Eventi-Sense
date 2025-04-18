import ChatPage from '../components/chatIcon/pageChat'
import MainNavbar from '../layout/components/MainNavbar';
import MainFooter from '../layout/MainFooter';

function messenger() {
  return (
    <div>
        <MainNavbar/>
    <div className='bg-gray-800 min-h-screen '>
      <ChatPage/>
    </div>
    <MainFooter/>
    </div>
  )
}

export default messenger
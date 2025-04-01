import MainFooter from '../../layout/MainFooter'
import MainNavbar from '../../layout/components/MainNavbar'
import ViewEvents from './EventDetails/eventDetails'

function Event() {

  return (
    <div   style={{ 
      background: 'linear-gradient(135deg, #014871 0%, #D7EDE2 100%)' 
    }} >
        <MainNavbar/>
        <ViewEvents/>

        <MainFooter/>
        
    </div>
  )
}

export default Event
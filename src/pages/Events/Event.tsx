import MainFooter from '../../layout/MainFooter'
import MainNavbar from '../../layout/components/MainNavbar'
import ViewEvents from './EventDetails/eventDetails'

function Event() {
  const cream = '#F9F7F2';
  return (
    <div style={{backgroundColor: cream}} >
        <MainNavbar/>
        <ViewEvents/>
        <MainFooter/>
        
    </div>
  )
}

export default Event
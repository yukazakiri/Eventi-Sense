import MainFooter from '../../layout/MainFooter'
import MainNavbar from '../../layout/components/MainNavbar'
import ViewEvents from './EventDetails/eventDetails'

function Event() {

  return (
    <div className='bg-[#1F2937] ' >
        <MainNavbar/>
        <ViewEvents/>

        <MainFooter/>
        
    </div>
  )
}

export default Event
import MainFooter from '../../layout/MainFooter'
import MainNavbar from '../../layout/MainNavbar'
import ViewEvents from './ViewEvents'

function Event() {
  return (
    <div className='bg-navy-blue-3' >
        <MainNavbar/>
        <ViewEvents/>
        <MainFooter/>
        
    </div>
  )
}

export default Event

import PaymentBooking from '../components/payment/bookingpayment/payment'
import MainNavbar from '../layout/components/MainNavbar'
import MainFooter from '../layout/MainFooter'

function paymentbooking() {
  return (
    <div>
        <div className='bg-navy-blue-5 h-screen'>
            <MainNavbar/>
        <PaymentBooking/>
        <MainFooter/>
        </div>
    </div>
  )
}

export default paymentbooking
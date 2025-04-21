import MainFooter from "../layout/MainFooter"
import MainNavbar from '../layout/components/MainNavbar'
import Image from "../assets/images/La Trinidad Benguet City Lights.jpg"
import { Link } from "react-router-dom"
import Button from "../components/Button/button"


function ContactUs() {
  return (
    <div>
      <MainNavbar/>
      <section className="noise-bg py-[12rem]">
  <div className="container mx-auto px-4 font-montserrat ">
    {/* Page Title */}
    <div className="text-center mb-8"> 
      <h2 className="text-6xl font-bold text-center gradient-text  mb-8 font-bonanova">
      Contact Us
    </h2>
    </div>
   
    <p className="text-lg text-gray-500 text-center mb-12">
      We'd love to hear from you! Reach out to us for any inquiries or feedback.
    </p>

    {/* Contact Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
        <form>
          {/* Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="johndoe@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Message Input */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full  text-white bg-navy-blue-3  hover:bg-navy-blue-5  font-semibold py-3 px-6 rounded-2xl hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Contact Information and Map */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Contact Info</h3>
        {/* Contact Details */}
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Address</h4>
            <p className="text-gray-600">
              123 Session Road, Baguio City<br />
              Benguet, Philippines 2600
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Phone</h4>
            <p className="text-gray-600">+63 (74) 123-4567</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700">Email</h4>
            <p className="text-gray-600">info@baguiocompany.com</p>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">Our Location</h4>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.091144276586!2d120.593214315343!3d16.41258898863005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a16879d9a5c5%3A0x6f5c2b5a5a5a5a5a!2sSession%20Road%2C%20Baguio%2C%20Benguet%2C%20Philippines!5e0!3m2!1sen!2sus!4v1633023222534!5m2!1sen!2sus"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>


    <section className="relative h-[400px] flex items-center justify-center overflow-hidden my-[4rem]">
      {/* Image as Background */}
      <div className="absolute inset-0 w-full h-full bg-cover ">
        <img
          src={Image}
          alt="Background"
          className="w-full h-full object-cover bg-cover rounded-[2rem]"
        />
      </div>

      {/* Overlay to darken the image for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[2rem]"></div>

      {/* Text Container with side margins */}
      <div className="relative z-10 text-center text-white mx-4 md:mx-8 lg:mx-16 xl:mx-32">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Flexible Plans Tailored for Every Business
        </h2>
        <p className="text-base md:text-lg mb-8">
          Simple, transparent pricing with no hidden fees.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
       
        <Link to="/Pricing">
                  <Button
                    label="Get Started for Free"

                    gradientText={true} // Gradient text
                    variant="primary"
                  />
                  </Link>
        </div>
      </div>
    </section>


  </div>

</section>

<MainFooter />
    </div>
  )
}

export default ContactUs
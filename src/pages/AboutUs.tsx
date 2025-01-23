import MainFooter from "../layout/MainFooter";
import MainNavbar from "../layout/MainNavbar";
import Image2 from "../assets/images/Session_Road___Baguio_City__Philippines-removebg-preview.png";
import { useState } from "react";

function AboutUs() {
  const [isExpanded, setIsExpanded] = useState(false); // State to manage expansion

  // Full paragraph content
  const fullText = `
    EventiSense was born from a shared vision between Jake Christon Agustin and Jeymark Bacurin, students at Data Center College of the Philippines, Baguio City. The journey began on August 12, 2024, when the duo recognized the complexity of event planning and the challenges faced by planners, suppliers, and venue managers in Baguio City. Inspired by the city’s bustling event culture and its potential for growth, they aimed to create a solution that would revolutionize event management through technology.
    Traditional event planning often involves juggling multiple tasks, coordinating with numerous stakeholders, and dealing with unforeseen complications. These challenges motivated the development of EventiSense—an integrated event management system designed to simplify processes, enhance coordination, and provide real-time support.
    With the integration of advanced technologies like AI-powered chatbots, comprehensive directories for venues and suppliers, and a user-friendly interface, EventiSense aims to be the ultimate tool for event organizers. 
    It doesn’t just cater to the needs of the event planners but also ensures a seamless experience for venue managers, suppliers, and event participants.
    EventiSense is more than just a tool; it is a vision to make event planning seamless, innovative, and accessible. By leveraging modern technologies, it seeks to address the unique challenges of event management in Baguio City while promoting local tourism and economic growth.
    As the development continues, the EventiSense team remains committed to innovation, collaboration, and the pursuit of excellence. The story of EventiSense is a testament to how a simple idea, driven by passion and determination, can evolve into a transformative solution for an entire industry.
  `;

  // Split the text into sentences
  const sentences = fullText.split('.');
  const truncatedText = sentences.slice(0, 4).join('. ') + '.';
  return (
    <div>
      <MainNavbar />
<section className="flex items-center justify-center text-white noise-bg py-[4rem] xl:py-[7rem]">
        <div className="p-6 md:p-10 mx-auto text-center">
          <h1 className="uppercase text-4xl lg:text-5xl font-bold font-bonanova gradient-text leading-snug md:leading-normal lg:leading-relaxed text-shadow">
            About EventiSense
          </h1>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-[4rem] xl:mt-[10rem]">
            <section className="font-montserrat text-lg lg:text-center text-left">
              <h1>Who we are?</h1>
              <p>
                EventiSense is a cutting-edge event management platform designed
                exclusively for events in Baguio City. Our system combines
                AI-powered features, comprehensive directories, and
                user-friendly tools to create an effortless planning experience.
              </p>
            </section>
            <section className="hidden xl:flex justify-center items-center relative">
              <div className="gradient-backgroundsimple rounded-full flex items-center justify-center md:w-[6.9rem] md:h-[7rem] lg:w-[16rem] lg:h-[16rem] relative">
                <div className="absolute -top-1/6 -left-1/6 w-[25rem] h-[25rem] rounded-full border-[1px] border-yellow-400" />
                <button className="absolute top-0 left-0 w-full h-full">
                  <h1 className="font-bold font-bonanova gradient-text text-[1.3rem] md:text-[2.2rem]">
                    EventiSense
                  </h1>
                </button>
              </div>
            </section>
            <section>
              <div className="pt-[2rem]">
                <button className="md:block flex md:mx-auto px-6 py-8 text-gray-200 text-[1.5rem] bg-gradient-to-r from-gray-400 via-gray-600 to-blue rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
                  Contact Us
                </button>
                <button className="md:block flex md:mx-auto px-6 py-8 mt-[2rem] text-gray-200 text-[1.5rem] bg-gradient-to-r from-blue via-gray-600 to-gray-400 rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
                  Plan Now
                </button>
              </div>
            </section>
          </div>
        </div>
  </section>
<section className="bg-gray-50 py-[5rem]">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Why Choose EventiSense?
        </h2>
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-pastelBlue  p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-blue-600">🌟</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Easy to Use</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              EventiSense simplifies event planning with an intuitive interface and powerful tools.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-pastelGreen p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-green-600">🚀</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Fast and Efficient</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              Save time with our streamlined processes and quick access to trusted vendors.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-pastelYellow p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-yellow-600">💡</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Innovative Solutions</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              Stay ahead with cutting-edge features designed to make your events unforgettable.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-pastelPink p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-pink-600">📅</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Seamless Scheduling</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              Effortlessly manage your event timeline with our smart scheduling tools.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-pastelPurple p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-purple-600">🤝</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Collaborative Platform</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              Work seamlessly with your team and vendors in one unified platform.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-pastelOrange p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
            {/* Icon */}
            <div className="flex justify-center">
              <span className="text-4xl text-orange-600">📊</span>
            </div>
            {/* Title */}
            <h3 className="text-xl font-bold mt-4 text-gray-800">Data-Driven Insights</h3>
            {/* Description */}
            <p className="mt-2 text-gray-600">
              Make informed decisions with real-time analytics and reporting.
            </p>
          </div>
        </div>
      </div>
    </section>
<section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Card container */}
        <div className="noise-bg rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row">
          {/* Image (left) */}
          <div className="lg:w-1/2 relative">
            {/* Image */}
            <img
              src={Image2}
              alt="Session Road, Baguio City"
              className="w-auto h-auto object-cover"
            />

            {/* Gradient overlay to darken top and bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50"></div>
          </div>

          {/* Text (right) */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-center">
            <h2 className="text-4xl font-bold gradient-text uppercase font-bonanova mb-4">
              Our Story
            </h2>
            {/* Paragraph with collapsible functionality */}
            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
                isExpanded ? 'max-h-[1000px]' : 'max-h-[100px]'
              }`}
            >

             <p className="text-gray-400 font-montserrat">
                {isExpanded ? fullText : truncatedText}
              </p>
            </div>
            {/* Show More/Show Less button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-300 hover:text-blue-600 focus:outline-none mt-2 flex items-center"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ml-1 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
<section className="bg-gray-50 pb-12">

  <div className="container mx-auto px-4">
 
    {/* Cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Mission Card */}
      <div className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg">
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova ">Mission</h3>
          <p className="text-white py-6">
            To revolutionize event planning by providing innovative, user-friendly tools that simplify the process and empower our users.
          </p>
        </div>
      </div>

      {/* Vision Card */}
      <div className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg">
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova">Vision</h3>
          <p className="text-white py-6">
            To become the leading event management platform globally, known for our commitment to innovation and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Values Card */}
      <div className="relative rounded-lg shadow-lg overflow-hidden h-[300px] noise-bg">
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-4xl font-bold gradient-text mb-2 font-bonanova">Values</h3>
          <p className="text-white py-6">
            We are committed to integrity, innovation, collaboration, and delivering exceptional value to our users.
          </p>
        </div>
      </div>
    </div>
  </div>
    </section>
<section className="bg-gray-50 pb-[5rem]">
  <div className="container mx-auto px-4 noise-bg py-12 rounded-lg" >
    <div className="text-center">
      {/* Heading */}
      <h2 className="text-4xl font-bold gradient-text font-bonanova mb-4">
        Ready to Get Started?
      </h2>
      {/* Subheading */}
      <p className="text-lg text-gray-200 mb-8">
        Join thousands of others who are already benefiting from our services. Contact us today or subscribe to stay updated!
      </p>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Contact Button */}
        <a
          href="#contact" // Replace with your contact link
          className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Contact Us
        </a>
        {/* Subscribe Button */}
        <a
          href="#subscribe" // Replace with your subscription link
          className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
        >
          Subscribe Now
        </a>
      </div>
    </div>
  </div>
</section>
      <MainFooter />
    </div>
  );
}

export default AboutUs;

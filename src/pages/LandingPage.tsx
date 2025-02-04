
import MainNavbar from "../layout/MainNavbar";
import Button from "../components/Button/button";
import CardList from "../layout/cards/Event/cardList";
import Cardvenues from "../layout/cards/Venue/cardList";
import CardSuppliers from "../layout/cards/Supplier/cardList";
import MainFooter from "../layout/MainFooter";
import ReviewSection from "../layout/cards/Review/cardDesign";
import { Link } from "react-router-dom";

const content: { title: string; text: string }[] = [
  { title: "Event Planning Tools", text: "Effortlessly create and manage event schedules with tools designed for efficiency. From budget planning to task management, EventiSense ensures every detail is organized and on track." },
  { title: "Event Collaboration Tools", text: "Seamlessly share event details with your team or clients for smooth collaboration. Assign tasks, track progress, and keep everyone aligned with real-time updates." },
  { title: "AI-Powered Chatbot Assistance", text: "Effortlessly create and manage event schedules with tools designed for efficiency. From budget planning to task management, EventiSense ensures every detail is organized and on track." },
];

const content1: { title: string; text: string }[] = [
  { 
    title: "Event Analytics", 
    text: "Track event performance with detailed analytics and insights. Measure attendance, engagement, and ROI to improve future events." 
  },
  { 
    title: "Customizable Event Templates", 
    text: "Save time with pre-designed, customizable event templates. Tailor them to your needs and ensure consistency across all your events." 
  },
  { 
    title: "Attendee Engagement Tools", 
    text: "Boost attendee interaction with polls, surveys, and live Q&A sessions. Keep your audience engaged and gather valuable feedback in real-time." 
  }
];

function HomePage() {
  return (

      <section className="static"> 
      <MainNavbar />
      <div className=" xl:">
        <section className="mt-[4rem] noise-bg h-auto py-[4rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center text-white mx-4 2xl:mx-[16rem] xl:mx-[8rem]">
              <div className=" p-6 md:py-[5rem] text-left ">
                <p className="text-5xl font-semibold font-montserrat leading-snug md:leading-normal lg:leading-relaxed">
                  Your dream event is just a click away with 
                </p>
                <h1 className="text-5xl md:text-4xl lg:text-[3rem] font-bold font-bonanova gradient-text leading-snug md:leading-normal lg:leading-relaxed uppercase">
                  EventiSense
                </h1>
              </div>
              <div className="p-6 lg:p-[5rem] ">
                <div className="font-montserrat text-justify">
                  <p>
                    EventiSense simplifies your event planning with powerful tools designed to help you coordinate smarter, manage faster, and connect deeper with trusted venues and suppliers.
                  </p>
                </div>
                <div className="pt-6 flex  md:flex-row gap-4">
                  <Link to="/Pricing">
                  <Button
                    label="Get Started for Free"
                    gradientText={true} // Gradient text
                    variant="secondary"
                  />
                  </Link>
                  <Link to="/contact">
                  <Button
                    label="Book a Demo"
                    gradientText={true} // Gradient text
                    variant="primary"
                  />
                  </Link>
                </div>
              </div>
            </div>
        </section>

        <section className="mx-auto 2xl:mx-[16rem] xl:mx-[8rem] my-[4rem] ">
                   <div className="flex justify-center  ">
                    <h1 className=" text-4xl  font-bold font-bonanova gradient-text  uppercase">Upcoming Events</h1>
                   </div>
                   <div className=" pt-[1rem] "> 
                     <CardList limit={4}/>
                   </div>  
        </section>

        <section className="relative noise-bg py-[2rem]">
                    <section className="mx-4 2xl:mx-[16rem] xl:mx-[8rem] my-[4rem]">
                     <div className="flex justify-between py-[10px]">
                       <h1 className="text-4xl font-bold font-bonanova gradient-text uppercase">Venues</h1>
                       <div className="text-white flex justify-end font-montserrat cursor-pointer hover:text-yellow-300">
                         <Button
                           label="View All"
                           onClick={() => alert('Gradient Text Button clicked!')}
                           gradientText={false} // Gradient text
                           variant="simple"
                         />
                       </div>
                     </div>
                        <Cardvenues limit={3} />
                    </section>
                    <section className="mx-4 2xl:mx-[16rem] xl:mx-[8rem] my-[4rem]">
                     <div className="flex justify-between py-[10px] ">
                       <h1 className="text-4xl font-bold font-bonanova gradient-text uppercase">Suppliers</h1>
                       <div className="text-white flex justify-end font-montserrat cursor-pointer hover:text-yellow-300">
                         <Button
                           label="View All"
                           onClick={() => window.location.href = '/suppliers'}
                    
                           gradientText={false} // Gradient text
                           variant="simple"
                         />
                       </div>
                     </div>
                        <CardSuppliers limit={3} />
                    </section>
                            
        </section>
      </div>
         
          <section className="flex justify-center items-center my-[4rem]">
            <div className="text-center py-[4rem]">
              <h1 className="text-4xl font-bold font-bonanova gradient-text uppercase">EVERYTHING YOU NEED TO KNOW</h1>
              <p className="text-gray-900 font-regular text-[1.2rem] w-auto md:w-[35rem] py-[2rem]  mx-auto font-montserrat">EventiSense is a cutting-edge event management platform designed to simplify and streamline event planning for organizers, venue managers, suppliers, and users. Our comprehensive features empower users to create, manage, and execute events effortlessly, leveraging AI-driven tools, advanced directories, and seamless collaboration features. Accessible across multiple devices, EventiSense ensures convenience, efficiency, and enhanced decision-making at every stage of the event planning process.</p>
              <div className="flex justify-center">
                <Link to="/contact">
                <Button
                  label="Contact Us"
               
                  gradientText={true} // Gradient text
                  variant="secondary"
                />
                </Link>
              </div>
            </div>
          </section>
          <section className="2xl:mx-[10rem] xl:mx-[5rem] py-[5rem] noise-bg rounded-[5rem]">
              <div className="flex justify-center my-[2rem]">
                <h1 className=" text-2xl md:text-4xl lg:text-4xl font-bold font-bonanova gradient-text uppercase">Our Key features </h1>
              </div> 
              <div className="grid lg:grid-cols-3 ">
                  <div className="flex justify-center items-center font-montserrat ">
                    <div className="lg:space-y-6 p-6 ">
                      {content.map((item, index) => (
                        <div key={index} className="lg:space-y-2 text-white lg:text-end text-center">
                          <h2 className="text-lg font-bold ">{item.title}</h2>
                          <p className=" text-sm font-thin pb-10 lg:pb-[4rem]">s
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                <div className=" justify-center items-center relative lg:flex hidden">
                  <div className="gradient-backgroundsimple rounded-full flex items-center justify-center md:w-[6.9rem] md:h-[7rem] lg:w-[16rem] lg:h-[16rem] relative">
                    <div className="absolute -top-1/6 -left-1/6 w-[25rem] h-[25rem] rounded-full  border-[1px] border-yellow-400" />
                    <button className="absolute top-0 left-0 w-full h-full">
                      <h1 className="font-bold font-bonanova gradient-text text-[1.3rem] md:text-[2.2rem]">
                        EventiSense
                      </h1>
                    </button>
                  </div>
                </div>
                  <div>
                  <div className="flex justify-center items-center font-montserrat ">
                    <div className="lg:space-y-6 p-6 ">
                      {content1.map((item, index) => (
                        <div key={index} className="lg:space-y-2 text-white lg:text-start text-center">
                          <h2 className="text-lg font-bold ">{item.title}</h2>
                          <p className=" text-sm font-thin pb-10 lg:pb-[4rem]">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
              </div>
             
          </section> 
          <section className="my-[4rem]">
            <ReviewSection/>
          </section>
          <div className="">
            <MainFooter />
          </div>
          
      </section>
      
    
   
  );
}

export default HomePage;

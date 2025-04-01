import CreateEventForm from "./Events/CreateEvents";
import MainNavbar from "../layout/components/MainNavbar";

export const CreateEvent = () => {
    return (
      <div className="bg-[#1F2937] w-full min-h-screen flex flex-col">
        <MainNavbar />
        <div className="max-w-7xl mx-auto py-28 "> 
          <CreateEventForm />
        </div>
      </div>
    );
  }
  
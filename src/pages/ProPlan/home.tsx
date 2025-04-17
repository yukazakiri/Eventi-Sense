import MainNavbar from "../../layout/components/MainNavbar";
import MainFooter from "../../layout/MainFooter";
import BusinessPlan from "./BusinessPlan";

function home() {
  return (
    <div>
        <MainNavbar/>
        <div className="bg-gradient-to-b from-[#2F4157] to-[#1e2a38]">
            <div className="py-32">
      <BusinessPlan/></div>
      </div>
      <MainFooter/>
    </div>
  )
}

export default home
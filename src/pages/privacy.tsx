import { motion } from "framer-motion";
import MainNavbar from "../layout/components/MainNavbar";
import MainFooter from "../layout/MainFooter";

// Constants for all text content
const PRIVACY_CONTENT = {
  title: "Privacy Policy",
  effectiveDate: "Effective Date: 04/08/2025",
  introduction: "EventiSense values your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our platform. By accessing or using the EventiSense website, you agree to the terms of this Privacy Policy.",
  updateNote: "We reserve the right to change this policy at any given time, of which you will be promptly updated. To ensure you are up to date with the latest changes, we advise you to frequently visit this page.",
  sections: [
    {
      title: "What User Data We Collect",
      content: "When you visit the website, we may collect the following data:",
      isList: true,
      items: [
        "Your IP address",
        "Your contact information and email address",
        "Other information such as interests and preferences",
        "Data profile regarding your online behavior on our website"
      ]
    },
    {
      title: "Why We Collect Your Data",
      content: "We are collecting your data for several reasons:",
      isList: true,
      items: [
        "To better understand your needs",
        "To improve our services and products",
        "To send you promotional emails containing content we think you will find interesting",
        "To contact you for surveys or market research",
        "To customize our website according to your behavior and preferences"
      ]
    },
    {
      title: "Safeguarding and Securing the Data",
      content: "EventiSense is committed to securing your data and keeping it confidential. EventiSense has done all in its power to prevent data theft, unauthorized access, and disclosure by implementing the latest technologies and software, which help us safeguard all the information we collect online.",
      isList: false,
      items: []
    },
    {
      title: "Links to Other Websites",
      content: "Our website may contain links that lead to other websites. If you click on these links, EventiSense is not held responsible for your data and privacy protection. Visiting those websites is not governed by this privacy policy agreement. Make sure to read the privacy policy documentation of the website you go to from our website.",
      isList: false,
      items: []
    },
    {
      title: "Restricting the Collection of your Personal Data",
      content: "You might wish to restrict the use and collection of your personal data. You can achieve this by:",
      isList: true,
      items: [
        "Contact us directly if you've already agreed to share your information"
      ],
      additionalContent: "EventiSense will not lease, sell, or distribute your personal information to any third parties, unless we have your permission or are required by law to do so. Your personal information will only be used to send you promotional materials if you agree to this privacy policy."
    },
    {
      title: "Acceptance of These Terms",
      content: "By using this platform, you signify your acceptance of this Privacy Policy. If you do not agree with this policy, please do not use our website. Continued use of the platform following updates or changes to this policy will be deemed your acceptance of those changes.",
      isList: false,
      items: []
    }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const titleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, type: "spring", stiffness: 100 }
  }
};

function Privacy() {
  return (
    <>
    <MainNavbar />
    <div className="min-h-screen bg-gray-800 py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto rounded-lg p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-center items-center flex-col">
          <motion.h1 
            className="text-3xl font-extralight uppercase font-bonanova tracking-wide text-center gradient-text mb-4"
            variants={titleVariants}
          >
            {PRIVACY_CONTENT.title}
          </motion.h1>
          <motion.p 
            className="text-gray-400 mb-6 text-center font-semibold"
            variants={itemVariants}
          >
            {PRIVACY_CONTENT.effectiveDate}
          </motion.p>
        </div>
        
        <motion.div 
          className="prose max-w-none font-sofia"
          variants={itemVariants}
        >
          <motion.p 
            className="text-gray-400 mb-4"
            variants={itemVariants}
          >
            {PRIVACY_CONTENT.introduction}
          </motion.p>
          
          <motion.p 
            className="text-gray-400 mb-6"
            variants={itemVariants}
          >
            {PRIVACY_CONTENT.updateNote}
          </motion.p>

          {PRIVACY_CONTENT.sections.map((section, index) => (
            <motion.section 
              className="mb-6" 
              key={index}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="text-2xl font-semibold text-gray-200 font-bonanova mb-4"
                whileHover={{ scale: 1.02, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {section.title}
              </motion.h2>
              
              {section.content && (
                <motion.p 
                  className="text-gray-400 mb-2"
                  variants={itemVariants}
                >
                  {section.content}
                </motion.p>
              )}
              
              {section.isList && section.items.length > 0 && (
                <motion.ul 
                  className="list-disc pl-6 text-gray-400 mb-4"
                  variants={containerVariants}
                >
                  {section.items.map((item, itemIndex) => (
                    <motion.li 
                      className={itemIndex < section.items.length - 1 ? "mb-2" : ""} 
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
              
              {section.additionalContent && (
                <motion.p 
                  className="text-gray-400"
                  variants={itemVariants}
                >
                  {section.additionalContent}
                </motion.p>
              )}
            </motion.section>
          ))}
        </motion.div>
      </motion.div>
    </div>
    <MainFooter />
    </>
  );
}

export default Privacy;
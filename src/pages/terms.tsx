// Constants for all text content
import { motion } from "framer-motion";
import MainNavbar from "../layout/components/MainNavbar";
import MainFooter from "../layout/MainFooter";

const TERMS_CONTENT = {
  title: " Terms and Conditions",
  introduction: "By accessing or using the EventiSense website (the \"Site\"), you agree to comply with and be bound by these Terms and Conditions (\"Terms\"). If you do not agree with any part of these Terms, please do not use the Site.",
  sections: [
    {
      title: "Use of the Site",
      items: [
        "1.1 EventiSense provides an integrated event management system with venue and supplier directories, designed for event planners, suppliers, and venue managers.",
        "1.2 You agree to use the Site only for lawful purposes and in accordance with these Terms."
      ]
    },
    {
      title: "User Accounts",
      items: [
        "2.1 To access certain features of the Site, you may need to create an account.",
        "2.2 You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
        "2.3 You agree to notify us immediately if you suspect any unauthorized use of your account."
      ]
    },
    {
      title: "Privacy Policy",
      items: [
        "3.1 Your use of the Site is also governed by our Privacy Policy.",
        "3.2 By using the Site, you consent to the collection, use, and sharing of your information as described in our Privacy Policy."
      ]
    },
    {
      title: "Intellectual Property",
      items: [
        "4.1 All content on the Site, including text, graphics, logos, images, videos, and software, is the property of EventiSense or its licensors and is protected by intellectual property laws.",
        "4.2 You may not reproduce, distribute, or use any content without prior written permission from EventiSense."
      ]
    },
    {
      title: "Prohibited Activities",
      introduction: "You agree not to:",
      isList: true,
      items: [
        "5.1 Violate any applicable laws, regulations, or third-party rights.",
        "5.2 Use the Site in any manner that could damage, disable, or overburden the Site.",
        "5.3 Interfere with or disrupt the operation of the Site, including using viruses or other harmful code.",
        "5.4 Attempt to gain unauthorized access to the Site, accounts, or networks."
      ]
    },
    {
      title: "Limitation of Liability",
      items: [
        "6.1 EventiSense is not responsible for any indirect, incidental, special, or consequential damage arising from your use of the Site.",
        "6.2 We do not guarantee the accuracy, reliability, or completeness of the information provided on the Site."
      ]
    },
    {
      title: "Termination",
      items: [
        "7.1 EventiSense reserves the right to suspend or terminate your access to the Site at our sole discretion, without notice, for any violation of these Terms or any other reason."
      ]
    },
    {
      title: "Changes to Terms",
      items: [
        "8.1 EventiSense may update these Terms at any time. Any changes will be posted on this page with an updated \"Effective Date.\" Your continued use of the Site after any changes to these Terms constitutes your acceptance of those changes."
      ]
    },
    {
      title: "Governing Law",
      items: [
        "9.1 These Terms are governed by and construed in accordance with the laws of the Philippines. Any disputes arising under or in connection with these Terms will be subject to the exclusive jurisdiction of the courts of Philippines."
      ]
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

function Terms() {
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
        <div className="flex justify-center items-center">
          <motion.h1 
            className="text-3xl font-extralight uppercase font-bonanova tracking-wide text-center gradient-text mb-8"
            variants={titleVariants}
          >
            {TERMS_CONTENT.title}
          </motion.h1>
        </div>
        
        <motion.div 
          className="prose max-w-none font-sofia"
          variants={itemVariants}
        >
          <p className="text-gray-400 mb-6">
            {TERMS_CONTENT.introduction}
          </p>

          {TERMS_CONTENT.sections.map((section, index) => (
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
              
              {section.introduction && (
                <p className="text-gray-400 mb-2">{section.introduction}</p>
              )}
              
              {section.isList ? (
                <ul className="list-disc pl-6 text-gray-400">
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
                </ul>
              ) : (
                section.items.map((item, itemIndex) => (
                  <motion.p 
                    className={`text-gray-400 ${itemIndex < section.items.length - 1 ? "mb-2" : ""}`}
                    key={itemIndex}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIndex * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {item}
                  </motion.p>
                ))
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

export default Terms;
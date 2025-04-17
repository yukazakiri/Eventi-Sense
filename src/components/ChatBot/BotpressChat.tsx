import React, { useEffect } from 'react';

const BotpressChat: React.FC = () => {
  useEffect(() => {
    // Load the first script
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Load the second script after the first one
    injectScript.onload = () => {
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2025/04/07/12/20250407125523-F4NHX8LV.js';
      configScript.async = true;
      document.body.appendChild(configScript);
    };

    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.body.removeChild(injectScript);
      const configScript = document.querySelector('script[src="https://files.bpcontent.cloud/2025/04/07/12/20250407125523-F4NHX8LV.js"]');
      if (configScript && configScript.parentNode) {
        configScript.parentNode.removeChild(configScript);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default BotpressChat;
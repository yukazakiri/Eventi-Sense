import React, { useEffect } from 'react';

const BotpressChat: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;

    script.onload = () => {
      // Once the main script is loaded, then load your custom config
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2025/04/07/12/20250407125523-F4NHX8LV.js';
      configScript.async = true;
      document.body.appendChild(configScript);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      // Optional cleanup for configScript if you saved a reference
    };
  }, []);

  return null;
};

export default BotpressChat;

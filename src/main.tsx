import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./styles/global.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabaseClient from './api/supabaseClient';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
        <App /> {/* App now only contains routes */}
      </SessionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
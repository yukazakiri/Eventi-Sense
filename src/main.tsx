import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./styles/global.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import supabaseClient from './api/supabaseClient';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
        <Toaster
          position="top-left"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              style: {
                background: 'linear-gradient(to right, #22c55e, #16a34a)',
                color: '#ffffff',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#22c55e',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: 'linear-gradient(to right, #ef4444, #dc2626)',
                color: '#ffffff',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
            },
          }}
        />
        <App />
      </SessionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
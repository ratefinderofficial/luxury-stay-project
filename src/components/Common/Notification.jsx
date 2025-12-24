import { Toaster } from 'react-hot-toast';

const Notification = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Global default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
        // Success Toast Styling (Luxury Green)
        success: {
          style: {
            borderLeft: '4px solid #10b981', // Green border
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        // Error Toast Styling (Alert Red)
        error: {
          style: {
            borderLeft: '4px solid #ef4444', // Red border
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        // Loading Toast Styling
        loading: {
          style: {
            borderLeft: '4px solid #3b82f6', // Blue border
          },
        },
      }}
    />
  );
};

export default Notification;
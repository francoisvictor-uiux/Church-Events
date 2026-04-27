import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Noto Kufi Arabic', sans-serif",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#F2F3F2',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100svh',
          maxHeight: '932px',
          background: '#F2F3F2',
          borderRadius: '2rem',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(1, 71, 97, 0.18)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
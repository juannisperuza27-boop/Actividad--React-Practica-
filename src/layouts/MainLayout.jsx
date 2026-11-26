import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-sm text-slate-400">
        SoundVault Music Store · Proyecto React 19 ADSO
      </footer>

      <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
    </div>
  );
}
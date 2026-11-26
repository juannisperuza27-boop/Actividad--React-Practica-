import { Link } from 'react-router';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <section className="max-w-xl mx-auto px-4 py-20 text-center">
      <title>404 - Página no encontrada | SoundVault</title>
      <FaExclamationTriangle className="text-amber-400 text-6xl mx-auto mb-4" />
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <p className="mt-2 text-lg text-slate-300">
        La ruta que buscas no existe o el instrumento fue retirado.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-2.5 rounded-lg transition-colors"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
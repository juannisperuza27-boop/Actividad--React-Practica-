import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Hero from '../components/Hero';
import Card from '../components/Card';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { getLatestProducts, toggleFavoriteProduct } from '../services/productsApi';

export default function HomePage() {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRecent() {
      try {
        setLoading(true);
        setError('');
        const data = await getLatestProducts(3);
        if (isMounted) {
          setRecentProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error al cargar los productos recientes.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleToggleFavorite(product) {
    try {
      const updated = await toggleFavoriteProduct(product.id, !product.favorite);
      setRecentProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.success(
        updated.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos'
      );
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar favoritos');
    }
  }

  return (
    <div>
      <title>SoundVault | Tienda de Música</title>

      <Hero
        title="Equipa tu música sin límites"
        subtitle="Explora guitarras, sintetizadores, percusión y equipos de estudio listos para sonar."
      />

      {/* Dos tarjetas de acción */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card bg="bg-slate-900 border-slate-800">
            <h2 className="text-2xl font-bold text-white">Para Músicos</h2>
            <p className="mt-2 text-slate-300">
              Explora nuestro catálogo por categoría, filtra por estado y guarda tus favoritos.
            </p>
            <Link
              to="/products"
              className="inline-block mt-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Explorar catálogo
            </Link>
          </Card>

          <Card bg="bg-amber-500/10 border-amber-500/30">
            <h2 className="text-2xl font-bold text-amber-300">Para Vendedores</h2>
            <p className="mt-2 text-slate-300">
              Publica un instrumento nuevo, usado o de colección con sus especificaciones técnicas.
            </p>
            <Link
              to="/add-product"
              className="inline-block mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Publicar equipo
            </Link>
          </Card>
        </div>
      </section>

      {/* Últimos 3 productos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
          Recién llegados
        </h2>

        {loading && <Spinner loading={loading} />}

        {!loading && error && (
          <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && recentProducts.length === 0 && (
          <p className="text-center text-slate-400">
            Aún no hay productos registrados en la tienda.
          </p>
        )}

        {!loading && !error && recentProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-block bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Ver todo el catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}
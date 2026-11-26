import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { getProducts, toggleFavoriteProduct } from '../services/productsApi';

export default function FavoritesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError('');
        const data = await getProducts();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No se pudieron cargar los favoritos.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFavorites();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleToggleFavorite(product) {
    try {
      const updated = await toggleFavoriteProduct(product.id, !product.favorite);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.info(
        updated.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos'
      );
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar favoritos');
    }
  }

  const favoriteProducts = products.filter((item) => item.favorite);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <title>Favoritos | SoundVault</title>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Tus Equipos Favoritos</h1>
        <p className="text-slate-400 mt-1">
          {favoriteProducts.length}{' '}
          {favoriteProducts.length === 1 ? 'equipo guardado' : 'equipos guardados'}
        </p>
      </div>

      {loading && <Spinner loading={loading} />}

      {!loading && error && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {!loading && !error && favoriteProducts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <p className="text-lg text-slate-300">
            Todavía no has marcado ningún instrumento o equipo como favorito.
          </p>
          <Link
            to="/products"
            className="inline-block mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      )}

      {!loading && !error && favoriteProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
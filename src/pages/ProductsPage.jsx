import { startTransition, useEffect, useOptimistic, useState } from 'react';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { getProducts, toggleFavoriteProduct } from '../services/productsApi';

const CATEGORIES = ['Todas', 'Cuerdas', 'Percusión', 'Teclados', 'Viento', 'Audio y Estudio'];
const CONDITIONS = ['Todas', 'Nuevo', 'Usado', 'Colección'];
const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedCondition, setSelectedCondition] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [optimisticProducts, setOptimisticFavorite] = useOptimistic(
    products,
    (currentList, { id, favorite }) =>
      currentList.map((item) => (item.id === id ? { ...item, favorite } : item))
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');
        const data = await getProducts({ _sort: '-createdAt' });
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No se pudo cargar el catálogo.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleToggleFavorite(product) {
    const nextFavorite = !product.favorite;
    startTransition(() => {
      setOptimisticFavorite({ id: product.id, favorite: nextFavorite });
    });

    try {
      const updated = await toggleFavoriteProduct(product.id, nextFavorite);
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.success(
        updated.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos'
      );
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar favoritos');
    }
  }

  // Estado derivado: filtrado combinable sin duplicar estado
  const filteredProducts = optimisticProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesCondition =
      selectedCondition === 'Todas' || product.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  // Paginación derivada
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleResetFilters() {
    setSearchTerm('');
    setSelectedCategory('Todas');
    setSelectedCondition('Todas');
    setCurrentPage(1);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <title>Catálogo | SoundVault</title>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Catálogo de Instrumentos y Audio</h1>
        <p className="text-slate-400 mt-1">
          Mostrando {filteredProducts.length} de {products.length} equipos disponibles
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="search-input" className="block text-xs font-semibold text-slate-400 mb-1">
            Buscar por nombre
          </label>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Ej. Fender, Yamaha, sintetizador..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label htmlFor="category-filter" className="block text-xs font-semibold text-slate-400 mb-1">
            Categoría
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="condition-filter" className="block text-xs font-semibold text-slate-400 mb-1">
            Estado
          </label>
          <select
            id="condition-filter"
            value={selectedCondition}
            onChange={(e) => {
              setSelectedCondition(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estados de carga, error o resultados */}
      {loading && <Spinner loading={loading} />}

      {!loading && error && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-4 rounded-lg text-center">
          {error}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <p className="text-lg text-slate-300 font-medium">
            No encontramos equipos que coincidan con tu búsqueda.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && paginatedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-40 hover:bg-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-300">
                Página <strong>{safePage}</strong> de <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white disabled:opacity-40 hover:bg-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
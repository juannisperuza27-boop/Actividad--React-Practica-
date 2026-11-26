import { useState } from 'react';
import { Link, useLoaderData, useNavigate, useRouteError } from 'react-router';
import { toast } from 'react-toastify';
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaHeart,
  FaRegHeart,
  FaCheckCircle,
  FaEnvelope,
  FaGlobeAmericas,
} from 'react-icons/fa';
import { deleteProduct, toggleFavoriteProduct } from '../services/productsApi';

export function ProductDetailError() {
  const error = useRouteError();

  return (
    <section className="max-w-xl mx-auto px-4 py-16 text-center">
      <title>Producto no encontrado | SoundVault</title>
      <h1 className="text-3xl font-extrabold text-white">
        No encontramos este equipo
      </h1>
      <p className="mt-3 text-slate-300">
        {error?.message || 'El producto solicitado no existe o fue eliminado.'}
      </p>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        <FaArrowLeft />
        Volver al catálogo
      </Link>
    </section>
  );
}

export default function ProductDetailPage() {
  const product = useLoaderData();
  const navigate = useNavigate();

  const [favoriteOverride, setFavoriteOverride] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isFavorite = favoriteOverride ?? Boolean(product.favorite);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(product.price);

  async function handleToggleFavorite() {
    const nextFavorite = !isFavorite;
    try {
      const updated = await toggleFavoriteProduct(product.id, nextFavorite);
      setFavoriteOverride(Boolean(updated.favorite));
      toast.success(
        updated.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos'
      );
    } catch (err) {
      toast.error(err.message || 'No se pudo actualizar favoritos');
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${product.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteProduct(product.id);
      toast.success('Producto eliminado correctamente');
      navigate('/products');
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar el producto');
      setDeleting(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <title>{product.title} | SoundVault</title>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold"
        >
          <FaArrowLeft />
          Volver al listado
        </Link>

        <button
          type="button"
          onClick={handleToggleFavorite}
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700 hover:border-rose-500/50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          {isFavorite ? (
            <>
              <FaHeart className="text-rose-500" />
              En favoritos
            </>
          ) : (
            <>
              <FaRegHeart className="text-slate-400" />
              Marcar favorito
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase mb-3">
              <span className="bg-amber-500/15 text-amber-400 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full">
                Estado: {product.condition}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {product.title}
            </h1>

            <p className="mt-4 text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Precio</p>
                <p className="text-2xl font-extrabold text-emerald-400">
                  {formattedPrice}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase">Disponibilidad</p>
                <p className="text-lg font-bold text-white">
                  {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Especificaciones técnicas
            </h2>
            <dl className="divide-y divide-slate-800">
              {(product.specs || []).map((spec, index) => (
                <div
                  key={`${spec.name}-${index}`}
                  className="py-3 flex justify-between gap-4 text-sm"
                >
                  <dt className="font-semibold text-slate-400">{spec.name}</dt>
                  <dd className="text-white text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              ¿Qué incluye?
            </h2>
            <ol className="space-y-2.5">
              {(product.includedItems || []).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-start gap-2.5 text-slate-300 text-sm"
                >
                  <FaCheckCircle className="text-emerald-400 mt-1 shrink-0" />
                  <span>
                    <strong className="text-white">{index + 1}.</strong> {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">
              Información de la marca
            </h2>
            <p className="text-xl font-extrabold text-amber-400">
              {product.brand?.name}
            </p>

            {product.brand?.country && (
              <p className="mt-2 text-sm text-slate-300 flex items-center gap-2">
                <FaGlobeAmericas className="text-slate-400 shrink-0" />
                {product.brand.country}
              </p>
            )}

            {product.brand?.supportEmail && (
              <p className="mt-2 text-sm text-slate-300 flex items-center gap-2 break-all">
                <FaEnvelope className="text-slate-400 shrink-0" />
                {product.brand.supportEmail}
              </p>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white mb-2">
              Gestionar equipo
            </h2>

            <Link
              to={`/edit-product/${product.id}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <FaEdit />
              Editar equipo
            </Link>

            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              <FaTrash />
              {deleting ? 'Eliminando...' : 'Eliminar equipo'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
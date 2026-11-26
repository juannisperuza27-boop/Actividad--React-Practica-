import { useState } from 'react';
import { Link } from 'react-router';
import { FaHeart, FaRegHeart, FaTag, FaBoxOpen } from 'react-icons/fa';

const MAX_LENGTH = 90;

export default function ProductCard({ product, onToggleFavorite }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isLongDescription = product.description.length > MAX_LENGTH;
  const displayedDescription =
    showFullDescription || !isLongDescription
      ? product.description
      : `${product.description.slice(0, MAX_LENGTH)}...`;

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
      <div>
        {/* Categoría y Favorito */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full">
            <FaTag />
            {product.category}
          </span>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(product)}
              aria-label={product.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className="p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {product.favorite ? (
                <FaHeart className="text-rose-500 text-lg" />
              ) : (
                <FaRegHeart className="text-slate-400 hover:text-rose-400 text-lg" />
              )}
            </button>
          )}
        </div>

        {/* Título y Marca */}
        <h3 className="text-lg font-bold text-white leading-snug">
          {product.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Marca: <span className="text-slate-200 font-medium">{product.brand?.name}</span> ·{' '}
          <span className="text-amber-300">{product.condition}</span>
        </p>

        {/* Descripción expandible */}
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          {displayedDescription}
        </p>

        {isLongDescription && (
          <button
            type="button"
            onClick={() => setShowFullDescription((prev) => !prev)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 mt-1.5 cursor-pointer"
          >
            {showFullDescription ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* Pie de tarjeta: Precio, Stock y Enlace */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-emerald-400">{formattedPrice}</p>
          <p className="text-xs text-slate-400 inline-flex items-center gap-1">
            <FaBoxOpen /> Stock: {product.stock}
          </p>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
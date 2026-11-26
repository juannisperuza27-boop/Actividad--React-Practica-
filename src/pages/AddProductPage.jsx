import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { createProduct } from '../services/productsApi';

const CATEGORIES = ['Cuerdas', 'Percusión', 'Teclados', 'Viento', 'Audio y Estudio'];
const CONDITIONS = ['Nuevo', 'Usado', 'Colección'];

export default function AddProductPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cuerdas');
  const [condition, setCondition] = useState('Nuevo');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [description, setDescription] = useState('');

  // Marca (objeto anidado)
  const [brandName, setBrandName] = useState('');
  const [brandCountry, setBrandCountry] = useState('');
  const [brandEmail, setBrandEmail] = useState('');

  // Especificaciones e ítems incluidos (separados por línea para facilitar la edición)
  const [specsText, setSpecsText] = useState('Cuerpo: Caoba\nAcabado: Satinado');
  const [includedText, setIncludedText] = useState('Manual de usuario\nCable de conexión');

  const [submitting, setSubmitting] = useState(false);

  function parseSpecs(rawText) {
    return rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, ...rest] = line.split(':');
        return {
          name: (name || 'Especificación').trim(),
          value: rest.join(':').trim() || 'Estándar',
        };
      });
  }

  function parseIncludedItems(rawText) {
    return rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!title.trim() || !brandName.trim() || !description.trim()) {
      toast.error('Completa el título, la marca y la descripción.');
      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      toast.error('Ingresa un precio válido mayor a 0.');
      return;
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      toast.error('Ingresa un stock válido (0 o más).');
      return;
    }

    const payload = {
      title: title.trim(),
      category,
      condition,
      price: numericPrice,
      stock: Math.floor(numericStock),
      description: description.trim(),
      brand: {
        name: brandName.trim(),
        country: brandCountry.trim() || 'No especificado',
        supportEmail: brandEmail.trim() || 'soporte@soundvault.com',
      },
      specs: parseSpecs(specsText),
      includedItems: parseIncludedItems(includedText),
    };

    try {
      setSubmitting(true);
      const created = await createProduct(payload);
      toast.success('Equipo publicado correctamente');
      navigate(`/products/${created.id}`);
    } catch (err) {
      toast.error(err.message || 'No se pudo publicar el equipo.');
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <title>Publicar Equipo | SoundVault</title>

      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold"
        >
          <FaArrowLeft />
          Volver al catálogo
        </Link>
        <h1 className="text-3xl font-extrabold text-white mt-3">
          Publicar Nuevo Equipo
        </h1>
        <p className="text-slate-400 mt-1">
          Registra un instrumento o equipo de audio con sus especificaciones.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6"
      >
        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-200 mb-1">
              Nombre del producto *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Fender Player Stratocaster"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-200 mb-1">
              Categoría *
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-semibold text-slate-200 mb-1">
              Estado *
            </label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-slate-200 mb-1">
              Precio (COP) *
            </label>
            <input
              id="price"
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej. 3200000"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-semibold text-slate-200 mb-1">
              Stock disponible *
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-200 mb-1">
            Descripción *
          </label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el sonido, estado estético, uso recomendado y detalles relevantes..."
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Información de Marca */}
        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white mb-3">Marca del fabricante</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="brandName" className="block text-sm font-semibold text-slate-200 mb-1">
                Marca *
              </label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ej. Fender"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="brandCountry" className="block text-sm font-semibold text-slate-200 mb-1">
                País de origen
              </label>
              <input
                id="brandCountry"
                type="text"
                value={brandCountry}
                onChange={(e) => setBrandCountry(e.target.value)}
                placeholder="Ej. Estados Unidos"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="brandEmail" className="block text-sm font-semibold text-slate-200 mb-1">
                Correo de soporte
              </label>
              <input
                id="brandEmail"
                type="email"
                value={brandEmail}
                onChange={(e) => setBrandEmail(e.target.value)}
                placeholder="soporte@marca.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Especificaciones e Incluye */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="specs" className="block text-sm font-semibold text-slate-200 mb-1">
              Especificaciones (una por línea, formato <code className="text-amber-400">Nombre: Valor</code>)
            </label>
            <textarea
              id="specs"
              rows="4"
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="included" className="block text-sm font-semibold text-slate-200 mb-1">
              ¿Qué incluye? (un elemento por línea)
            </label>
            <textarea
              id="included"
              rows="4"
              value={includedText}
              onChange={(e) => setIncludedText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Botón enviar */}
        <div className="pt-2 flex justify-end gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <FaSave />
            {submitting ? 'Guardando...' : 'Publicar equipo'}
          </button>
        </div>
      </form>
    </section>
  );
}
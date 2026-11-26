import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { getProductById, updateProduct } from '../services/productsApi';

const CATEGORIES = ['Cuerdas', 'Percusión', 'Teclados', 'Viento', 'Audio y Estudio'];
const CONDITIONS = ['Nuevo', 'Usado', 'Colección'];

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Conservamos campos existentes como favorite y createdAt
  const [existingMeta, setExistingMeta] = useState({
    favorite: false,
    createdAt: '',
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cuerdas');
  const [condition, setCondition] = useState('Nuevo');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [description, setDescription] = useState('');

  const [brandName, setBrandName] = useState('');
  const [brandCountry, setBrandCountry] = useState('');
  const [brandEmail, setBrandEmail] = useState('');

  const [specsText, setSpecsText] = useState('');
  const [includedText, setIncludedText] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError('');
        const data = await getProductById(id);

        if (!isMounted) return;

        setTitle(data.title || '');
        setCategory(data.category || 'Cuerdas');
        setCondition(data.condition || 'Nuevo');
        setPrice(String(data.price ?? ''));
        setStock(String(data.stock ?? 0));
        setDescription(data.description || '');

        setBrandName(data.brand?.name || '');
        setBrandCountry(data.brand?.country || '');
        setBrandEmail(data.brand?.supportEmail || '');

        setSpecsText(
          (data.specs || []).map((s) => `${s.name}: ${s.value}`).join('\n')
        );
        setIncludedText((data.includedItems || []).join('\n'));

        setExistingMeta({
          favorite: Boolean(data.favorite),
          createdAt: data.createdAt || new Date().toISOString(),
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No se pudo cargar el equipo para editar.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

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

    const updatedPayload = {
      id,
      title: title.trim(),
      category,
      condition,
      price: numericPrice,
      stock: Math.floor(numericStock),
      description: description.trim(),
      favorite: existingMeta.favorite,
      createdAt: existingMeta.createdAt,
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
      await updateProduct(id, updatedPayload);
      toast.success('Cambios guardados correctamente');
      navigate(`/products/${id}`);
    } catch (err) {
      toast.error(err.message || 'No se pudieron guardar los cambios.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Spinner loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-300 bg-rose-500/10 border border-rose-500/40 p-4 rounded-lg">
          {error}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 text-amber-400 hover:text-amber-300 font-semibold"
        >
          <FaArrowLeft />
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <title>Editar: {title} | SoundVault</title>

      <div className="mb-6">
        <Link
          to={`/products/${id}`}
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold"
        >
          <FaArrowLeft />
          Volver al detalle
        </Link>
        <h1 className="text-3xl font-extrabold text-white mt-3">
          Editar Equipo
        </h1>
        <p className="text-slate-400 mt-1">
          Actualiza la información y especificaciones de <strong>{title}</strong>.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="edit-title" className="block text-sm font-semibold text-slate-200 mb-1">
              Nombre del producto *
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-semibold text-slate-200 mb-1">
              Categoría *
            </label>
            <select
              id="edit-category"
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
            <label htmlFor="edit-condition" className="block text-sm font-semibold text-slate-200 mb-1">
              Estado *
            </label>
            <select
              id="edit-condition"
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
            <label htmlFor="edit-price" className="block text-sm font-semibold text-slate-200 mb-1">
              Precio (COP) *
            </label>
            <input
              id="edit-price"
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="edit-stock" className="block text-sm font-semibold text-slate-200 mb-1">
              Stock disponible *
            </label>
            <input
              id="edit-stock"
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

        <div>
          <label htmlFor="edit-description" className="block text-sm font-semibold text-slate-200 mb-1">
            Descripción *
          </label>
          <textarea
            id="edit-description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-800">
          <h2 className="text-lg font-bold text-white mb-3">Marca del fabricante</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="edit-brandName" className="block text-sm font-semibold text-slate-200 mb-1">
                Marca *
              </label>
              <input
                id="edit-brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="edit-brandCountry" className="block text-sm font-semibold text-slate-200 mb-1">
                País de origen
              </label>
              <input
                id="edit-brandCountry"
                type="text"
                value={brandCountry}
                onChange={(e) => setBrandCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="edit-brandEmail" className="block text-sm font-semibold text-slate-200 mb-1">
                Correo de soporte
              </label>
              <input
                id="edit-brandEmail"
                type="email"
                value={brandEmail}
                onChange={(e) => setBrandEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-specs" className="block text-sm font-semibold text-slate-200 mb-1">
              Especificaciones (una por línea, formato <code className="text-amber-400">Nombre: Valor</code>)
            </label>
            <textarea
              id="edit-specs"
              rows="4"
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="edit-included" className="block text-sm font-semibold text-slate-200 mb-1">
              ¿Qué incluye? (un elemento por línea)
            </label>
            <textarea
              id="edit-included"
              rows="4"
              value={includedText}
              onChange={(e) => setIncludedText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Link
            to={`/products/${id}`}
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
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </section>
  );
}
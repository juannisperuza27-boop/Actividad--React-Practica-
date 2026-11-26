import { ClipLoader } from 'react-spinners';

export default function Spinner({ loading = true }) {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center py-12" role="status" aria-label="Cargando">
      <ClipLoader color="#f59e0b" size={50} />
    </div>
  );
}
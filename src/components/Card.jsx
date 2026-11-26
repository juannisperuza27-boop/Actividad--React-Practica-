export default function Card({ children, bg = 'bg-slate-900 border-slate-800' }) {
  return (
    <div className={`${bg} border rounded-xl p-6 shadow-md`}>
      {children}
    </div>
  );
}
export default function Hero({
  title = 'Encuentra tu próximo sonido',
  subtitle = 'Instrumentos, amplificadores y equipo de estudio seleccionados para músicos y productores.',
}) {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-14 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-4xl">
        🐾
      </div>
      
      <h1 className="mb-2 text-2xl font-bold">Пока здесь пусто</h1>
      <p className="mb-8 text-sm text-gray-500">
        В Татарстане много питомцев ждут своего человека. <br />
        Будьте первым, кто добавит анкету!
      </p>

      <Link 
        href="/create"
        className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-transform active:scale-95"
      >
        Добавить питомца
      </Link>
      
      <div className="mt-12 grid w-full grid-cols-2 gap-4">
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-xs text-gray-400">
          Место для фильтров
        </div>
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-xs text-gray-400">
          Статистика приютов
        </div>
      </div>
    </div>
  );
}

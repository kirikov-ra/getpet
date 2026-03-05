import { PetDto } from "@shared/types/pet";
import { PetCard } from "../../features/pets/components/PetCard";

async function getPets(): Promise<{ data: PetDto[]; error: string | null }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${baseUrl}/pets`;

  try {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000) 
    });

    if (!res.ok) {
      const errorMsg = `API Error: ${res.status} ${res.statusText}`;
      console.error(`❌ [Server] ${errorMsg} at ${endpoint}`);
      return { data: [], error: errorMsg };
    }

    const data = await res.json();
    console.log(`✅ [Server] Fetched ${data.length} pets from ${endpoint}`);
    return { data, error: null };

  } catch (err: any) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown network error';
    console.error(`❌ [Server] Fetch failed: ${errorMsg}`);
    return { data: [], error: errorMsg };
  }
}

export default async function PetsPage() {
  const { data: pets, error } = await getPets();

  return (
    <main className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl">
          Наши хвостики
        </h1>
        <p className="text-lg text-gray-500 font-medium max-w-2xl">
          Все питомцы проходят проверку и готовы к переезду в новый дом.
        </p>
      </header>

      <section>
        {error ? (
          <div className="p-12 border-2 border-dashed border-red-100 rounded-[3rem] bg-red-50/30 text-center">
            <p className="text-red-600 font-bold uppercase tracking-widest text-xs">
              Проблема со связью
            </p>
            <p className="text-red-400 text-sm mt-2">{error}</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="p-20 border-2 border-dashed border-gray-100 rounded-[3rem] text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Здесь пока пусто...
            </p>
            <p className="text-gray-300 text-sm mt-2">Скоро здесь появятся новые анкеты</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
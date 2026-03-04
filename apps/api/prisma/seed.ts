import { PrismaClient, Role, Gender, PetStatus } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('❌ DATABASE_URL не найден в файле .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Начинаем заливку тестовых данных (Seeding)...');

  const dogCategory = await prisma.category.upsert({
    where: { slug: 'dogs' },
    update: {},
    create: { slug: 'dogs', name: 'Собаки' },
  });

  const catCategory = await prisma.category.upsert({
    where: { slug: 'cats' },
    update: {},
    create: { slug: 'cats', name: 'Кошки' },
  });

  const corgi = await prisma.breed.upsert({
    where: { slug: 'welsh-corgi' },
    update: {},
    create: {
      slug: 'welsh-corgi',
      name: 'Вельш-корги пемброк',
      categoryId: dogCategory.id,
      description: 'Небольшая пастушья собака, очень преданная и активная.',
      characteristics: ['Активный', 'Дружелюбный', 'Короткие лапы'],
    },
  });

  // ИСПРАВЛЕНИЕ: Ищем по phone, обновляем email, если номер уже есть
  const shelterDirector = await prisma.user.upsert({
    where: { phone: '+79001112233' },
    update: {
      email: 'director@kazan-pets.ru',
      name: 'Тимур (Директор)',
      role: Role.SHELTER_OWNER,
    },
    create: {
      email: 'director@kazan-pets.ru',
      phone: '+79001112233',
      name: 'Тимур (Директор)',
      role: Role.SHELTER_OWNER,
    },
  });

  const kazanShelter = await prisma.shelter.upsert({
    where: { slug: 'dobrye-ruki-kazan' },
    update: {
      ownerId: shelterDirector.id, // Гарантируем привязку к правильному директору
    },
    create: {
      slug: 'dobrye-ruki-kazan',
      name: 'Приют "Добрые руки"',
      description: 'Крупнейший приют в Республике Татарстан. Спасаем и лечим.',
      address: 'ул. Аграрная, 2',
      city: 'Казань',
      region: 'Татарстан',
      phone: '+78431112233',
      ownerId: shelterDirector.id,
    },
  });

  // ИСПРАВЛЕНИЕ: Защита от дублирования питомцев при повторных запусках
  const existingPetsCount = await prisma.pet.count({
    where: { shelterId: kazanShelter.id },
  });

  if (existingPetsCount === 0) {
    await prisma.pet.create({
      data: {
        name: 'Чарли',
        categoryId: dogCategory.id,
        breedId: corgi.id,
        gender: Gender.MALE,
        description: 'Молодой и энергичный корги. Обожает долгие прогулки.',
        city: 'Казань',
        region: 'Татарстан',
        status: PetStatus.AVAILABLE,
        shelterId: kazanShelter.id,
        isSterilized: true,
        isVaccinated: true,
        birthDate: new Date('2024-01-15T00:00:00.000Z'),
        weight: 12.5,
        tags: ['игривый', 'любит детей', 'приучен к поводку'],
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af',
              isPrimary: true,
            },
          ],
        },
      },
    });
    console.log('🐶 Тестовый питомец Чарли добавлен.');
  } else {
    console.log(
      `ℹ️ В приюте уже есть питомцы (${existingPetsCount} шт), пропускаем создание Чарли.`,
    );
  }

  console.log('✅ База данных успешно наполнена тестовыми данными!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при выполнении seed-скрипта:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

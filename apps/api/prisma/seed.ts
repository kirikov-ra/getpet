import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL не найден в переменных окружения');
}

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Начинаем наполнение базы данных через pg-adapter...');

  const dogCategory = await prisma.category.upsert({
    where: { slug: 'dog' },
    update: {},
    create: { slug: 'dog', name: 'Собаки' },
  });

  const catCategory = await prisma.category.upsert({
    where: { slug: 'cat' },
    update: {},
    create: { slug: 'cat', name: 'Кошки' },
  });

  console.log(`✅ Категории готовы: ${dogCategory.name}, ${catCategory.name}`);

  await prisma.breed.upsert({
    where: { slug: 'golden-retriever' },
    update: {},
    create: {
      slug: 'golden-retriever',
      name: 'Золотистый ретривер',
      categoryId: dogCategory.id,
      description: 'Идеальная семейная собака, очень дружелюбная.',
    },
  });

  await prisma.breed.upsert({
    where: { slug: 'maine-coon' },
    update: {},
    create: {
      slug: 'maine-coon',
      name: 'Мейн-кун',
      categoryId: catCategory.id,
      description: 'Крупная аборигенная порода кошек с кисточками на ушах.',
    },
  });

  console.log('✅ Базовые породы добавлены.');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидировании:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Корректно закрываем и Prisma, и пул pg
    await prisma.$disconnect();
    await pool.end();
  });

/* Seed script for dev/demo data. Run with `npm run seed`. */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const topicPool = [
  'AI',
  'Productivity',
  'Engineering',
  'Marketing',
  'Growth',
  'Leadership',
  'Design',
  'Data',
  'Security',
  'DevOps',
  'Analytics',
  'Web3',
  'Research',
];

const intentPool = [
  'learn redux quickly',
  'ship faster with AI',
  'product-led growth',
  'improve onboarding',
  'optimize funnels',
  'deep dive into security',
  'write better cold emails',
  'modern frontend patterns',
  'scale data pipelines',
  'kubernetes refresh',
  'seo experiments',
  'design systems',
];

const sampleParagraphs = [
  'This piece explores pragmatic workflows teams use to ship high-quality features without sacrificing velocity.',
  'A concise breakdown of the architecture choices behind resilient web backends and their trade-offs.',
  'Key tactics to align product, design, and engineering around measurable outcomes.',
  'A tour of modern AI tooling that reduces boilerplate and accelerates experimentation.',
  'Hands-on examples showing how to turn raw data into meaningful insights with lightweight pipelines.',
  'Framework-agnostic lessons learned from running design systems at scale.',
  'Battle-tested approaches to security hardening while keeping developer experience pleasant.',
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const pickMany = <T,>(arr: T[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.article.deleteMany();
  await prisma.intent.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.user.deleteMany();

  // Topics & intents
  const topics = await Promise.all(
    topicPool.map((value) => prisma.topic.create({ data: { value } })),
  );
  const intents = await Promise.all(
    intentPool.map((value) => prisma.intent.create({ data: { value } })),
  );

  // Users
  const basePassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all(
    Array.from({ length: 8 }).map((_, idx) =>
      prisma.user.create({
        data: {
          email: `demo${idx + 1}@laterly.ai`,
          name: `Demo User ${idx + 1}`,
          password: basePassword,
        },
      }),
    ),
  );

  // Articles per user
  const articlesPerUser = 12;
  for (const user of users) {
    for (let i = 0; i < articlesPerUser; i++) {
      const selectedTopics = pickMany(topics, Math.max(2, Math.floor(Math.random() * 4)));
      const selectedIntents = pickMany(intents, 1);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 40));

      await prisma.article.create({
        data: {
          url: `https://laterly.ai/demo/${user.id}/${i}`,
          title: `${pick(['Insight', 'Guide', 'Playbook', 'Brief'])}: ${pick(sampleParagraphs).slice(0, 40)}`,
          content: sampleParagraphs.join(' '),
          summary: pick(sampleParagraphs),
          isRead: Math.random() > 0.5,
          createdAt,
          userId: user.id,
          topics: {
            connect: selectedTopics.map((t) => ({ id: t.id })),
          },
          intents: {
            connect: selectedIntents.map((i) => ({ id: i.id })),
          },
        },
      });
    }
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

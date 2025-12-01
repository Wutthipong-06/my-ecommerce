import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding...')

  // ลบข้อมูลเก่า (ถ้ามี) - ต้องลบ Post ก่อนเพราะมี relation กับ User
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // สร้าง users ทดสอบ
  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'hashed_password_123', // ในจริงต้อง hash
      role: 'ADMIN'
    }
  })

  const jane = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: 'hashed_password_456',
      role: 'USER'
    }
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Johnson',
      password: 'hashed_password_789',
      role: 'USER'
    }
  })

  console.log(`✅ Created 3 users.`)

  // สร้าง posts ทดสอบ
  const posts = await prisma.post.createMany({
    data: [
      {
        title: 'First Post by John',
        content: 'This is the content of the first post.',
        published: true,
        authorId: john.id
      },
      {
        title: 'Second Post by Jane',
        content: 'This is the content of the second post.',
        published: true,
        authorId: jane.id
      },
      {
        title: 'Draft Post by Bob',
        content: 'This is a draft post.',
        published: false,
        authorId: bob.id
      }
    ]
  })

  console.log(`✅ Created ${posts.count} posts.`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
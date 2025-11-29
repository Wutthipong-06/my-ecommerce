import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding...')

  // ลบข้อมูลเก่า (ถ้ามี)
  await prisma.user.deleteMany()

  // สร้าง Users ทดสอบ
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john@example.com',
        name: 'John Doe',
        password: 'hashed_password_123', // ในจริงต้อง hash
        role: 'ADMIN'
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: 'hashed_password_456',
        role: 'USER'
      },
      {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        password: 'hashed_password_789',
        role: 'USER'
      }
    ]
  })

  console.log(`✅ Created ${users.count} users`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
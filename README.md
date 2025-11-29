สรุป Commands ที่ใช้งานบ่อย
🐳 Docker Compose Commands
เริ่มต้นและหยุด
bash# เริ่ม services ทั้งหมด (รันเบื้องหลัง)
docker compose up -d

# เริ่ม services แบบเห็น logs
docker compose up

# หยุด services
docker compose down

# หยุดและลบ volumes (ลบข้อมูล database ด้วย)
docker compose down -v

# Restart services ทั้งหมด
docker compose restart

# Restart service เดียว
docker compose restart postgres
ดูสถานะและ Logs
bash# ดูสถานะ containers
docker compose ps

# ดู logs ทั้งหมด
docker compose logs

# ดู logs แบบ real-time
docker compose logs -f

# ดู logs ของ service เดียว
docker compose logs -f postgres
docker compose logs -f redis
จัดการ Services
bash# Build/Rebuild images
docker compose build

# Build และ start
docker compose up -d --build

# หยุด service เดียว
docker compose stop postgres

# เริ่ม service เดียว
docker compose start postgres

# ลบ containers ที่หยุดแล้ว
docker compose rm

🗄️ Prisma Commands
Setup และ Migration
bash# Initial Prisma
bunx prisma init

# สร้าง migration
bunx prisma migrate dev --name init
bunx prisma migrate dev --name add_users
bunx prisma migrate dev --name add_products

# Generate Prisma Client
bunx prisma generate

# Reset database (ลบข้อมูลทั้งหมด)
bunx prisma migrate reset

# Deploy migration to production
bunx prisma migrate deploy
ดูและจัดการข้อมูล
bash# เปิด Prisma Studio (GUI สำหรับดู/แก้ไขข้อมูล)
bunx prisma studio

# Seed data
bunx prisma db seed

# Pull schema จาก database
bunx prisma db pull

# Push schema ไป database (ไม่สร้าง migration)
bunx prisma db push
ตรวจสอบ
bash# Format schema file
bunx prisma format

# Validate schema
bunx prisma validate

🚀 Next.js (Bun) Commands
Development
bash# รัน development server
bun dev

# รันที่ port อื่น
bun dev --port 3001

# Build production
bun run build

# รัน production
bun start
Dependencies
bash# ติดตั้ง package
bun add package-name

# ติดตั้ง dev dependencies
bun add -d package-name

# ลบ package
bun remove package-name

# อัพเดท packages
bun update

# ติดตั้งตาม package.json
bun install

🛠️ Docker Commands (ทั่วไป)
ดูข้อมูล
bash# ดู containers ที่รันอยู่
docker ps

# ดู containers ทั้งหมด (รวมที่หยุดแล้ว)
docker ps -a

# ดู images
docker images

# ดู volumes
docker volume ls

# ดู networks
docker network ls
เข้าไปใน Container
bash# เข้าไปใน PostgreSQL container
docker compose exec postgres psql -U postgres -d ecommerce

# เข้าไปใน Redis container
docker compose exec redis redis-cli

# เข้าไปใน container แบบ bash
docker compose exec postgres bash
ลบและทำความสะอาด
bash# ลบ containers ที่หยุดแล้ว
docker container prune

# ลบ images ที่ไม่ใช้
docker image prune

# ลบ volumes ที่ไม่ใช้
docker volume prune

# ลบทุกอย่างที่ไม่ใช้
docker system prune

# ลบทุกอย่างรวม volumes
docker system prune -a --volumes

📊 PostgreSQL Commands
bash# เชื่อมต่อ database
docker compose exec postgres psql -U postgres -d ecommerce

# ใน psql:
\l              # ดู databases
\c ecommerce    # เปลี่ยน database
\dt             # ดู tables
\d table_name   # ดู schema ของ table
\q              # ออกจาก psql

# Query ข้อมูล
SELECT * FROM "User";
SELECT * FROM "Product" LIMIT 10;

# Backup database
docker compose exec postgres pg_dump -U postgres ecommerce > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres ecommerce < backup.sql

🔧 Redis Commands
bash# เชื่อมต่อ Redis
docker compose exec redis redis-cli

# ใน redis-cli:
PING           # ทดสอบการเชื่อมต่อ
KEYS *         # ดู keys ทั้งหมด
GET key_name   # ดูค่าของ key
SET key value  # ตั้งค่า
DEL key        # ลบ key
FLUSHALL       # ลบข้อมูลทั้งหมด
EXIT           # ออก

⚡ Workflow แนะนำ
เริ่มงานทุกวัน
bash# 1. เริ่ม database services
docker compose up -d

# 2. ตรวจสอบสถานะ
docker compose ps

# 3. รัน Next.js
bun dev

# 4. เปิด Prisma Studio (ถ้าต้องการ)
bunx prisma studio
เมื่อแก้ Prisma Schema
bash# 1. แก้ไขไฟล์ schema.prisma

# 2. สร้าง migration
bunx prisma migrate dev --name your_migration_name

# 3. (Optional) Seed data
bunx prisma db seed
เมื่อเจอปัญหา
bash# 1. ดู logs
docker compose logs -f

# 2. Restart services
docker compose restart

# 3. ถ้ายังไม่ได้ลอง rebuild
docker compose down
docker compose up -d --build

# 4. ถ้ายังไม่ได้ลบและเริ่มใหม่
docker compose down -v
docker compose up -d
bunx prisma migrate dev
ปิดงาน
bash# หยุด services
docker compose down

# หรือปล่อยให้รันต่อไปก็ได้ (ไม่กินทรัพยากรมาก)

🎯 Commands ที่ใช้บ่อยสุด
bash# TOP 5 ที่ใช้บ่อยที่สุด
docker compose up -d              # เริ่ม services
docker compose down              # หยุด services
docker compose logs -f           # ดู logs
bunx prisma migrate dev         # Update database schema
bun dev                         # รัน Next.js

📝 เคล็ดลับ

สร้าง aliases ใน .bashrc หรือ .zshrc:

bashalias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dclogs='docker compose logs -f'
alias pstudio='bunx prisma studio'

ใช้งาน:

bashdc up -d      # แทน docker compose up -d
dcdown        # แทน docker compose down
dclogs        # แทน docker compose logs -f

# Port ต่างๆ
Next.js App: http://localhost:3000
Prisma Studio: รันคำสั่ง bunx prisma studio → http://localhost:5555
pgAdmin: http://localhost:5050 (login: admin@admin.com / admin)
Database: localhost:5432
Redis: localhost:6379

# Troubleshooting
ปัญหา: Port 5432 ถูกใช้งานแล้ว
bash# ดูว่า process ไหนใช้ port
lsof -i :5432  # Mac/Linux
netstat -ano | findstr :5432  # Windows

# เปลี่ยน port ใน docker-compose.yml
ports:
  - "5433:5432"  # ใช้ port 5433 แทน

# อัพเดท DATABASE_URL ใน .env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5433/ecommerce"
ปัญหา: Cannot connect to database
bash# ตรวจสอบว่า container ทำงานอยู่
docker compose ps


# 🎯 คำสั่งสำคัญที่ต้องจำคำสั่งใช้เมื่อไหร่bunx prisma migrate devแก้ไข schema และต้องการสร้าง migration ใหม่bunx prisma generateต้องการ update Prisma Client (มักรันอัตโนมัติแล้วใน migrate dev)bunx prisma studioต้องการดู/แก้ไขข้อมูลใน databasebunx prisma migrate resetต้องการลบข้อมูลทั้งหมดและเริ่มใหม่

# การตั้งชื่อ migrate
# ✅ ดี - บอกว่าทำอะไร
bunx prisma migrate dev --name add_cart_tables
bunx prisma migrate dev --name add_user_address
bunx prisma migrate dev --name update_product_add_sku

# ถ้าเจอ Error ให้ตรวจสอบ
bash# ดูว่า migration ไหนรันแล้วบ้าง
bunx prisma migrate status

# ดู migration history
ls prisma/migrations/

# แก้ไข migration ที่ยังไม่ apply
# (แก้ไขไฟล์ .sql โดยตรงได้)

# ถ้าต้องการลบข้อมูลและเริ่มใหม่
bash# Reset database (ลบข้อมูลทั้งหมด + รัน migrations ใหม่ + seed)
bunx prisma migrate reset

# ถ้าต้องการดูข้อมูลโดยไม่เปิด Studio
bash# เข้าไปใน PostgreSQL
docker compose exec postgres psql -U postgres -d ecommerce

# ใน psql
\dt                    # ดู tables ทั้งหมด
\d "Cart"              # ดู structure ของ table Cart
SELECT * FROM "Cart";  # ดูข้อมูลใน Cart
\q                     # ออก

# Workflow ที่แนะนำ
bash# 1. แก้ schema.prisma
code prisma/schema.prisma

# 2. Migrate
bunx prisma migrate dev --name your_change_name

# 3. ดูผลลัพธ์
bunx prisma studio

# 4. (Optional) Test ใน code
bun dev
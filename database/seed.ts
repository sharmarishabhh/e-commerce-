// database/seed.ts
import { PrismaClient, Role, CowStatus, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@gaushala.com" },
    update: {},
    create: { email: "admin@gaushala.com", passwordHash: adminHash, name: "Admin", role: Role.ADMIN },
  });

  const userHash = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: { email: "user@example.com", passwordHash: userHash, name: "Test User", role: Role.USER },
  });

  const dairy = await prisma.category.upsert({
    where: { slug: "dairy" }, update: {},
    create: { name: "Dairy", slug: "dairy", description: "Fresh dairy products" },
  });
  const organic = await prisma.category.upsert({
    where: { slug: "organic" }, update: {},
    create: { name: "Organic", slug: "organic", description: "Certified organic products" },
  });

  const productList = [
    { name: "Pure A2 Cow Milk", slug: "pure-a2-cow-milk", price: 80, stock: 200, categoryId: dairy.id, imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400" },
    { name: "Desi Cow Ghee", slug: "desi-cow-ghee", price: 850, stock: 50, categoryId: dairy.id, imageUrl: "https://images.unsplash.com/photo-1628288789888-b4fa8e2e5759?w=400" },
    { name: "Organic Cow Manure", slug: "organic-cow-manure", price: 150, stock: 100, categoryId: organic.id, imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400" },
    { name: "Fresh Paneer", slug: "fresh-paneer", price: 200, stock: 80, categoryId: dairy.id, imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
    { name: "Fresh Curd", slug: "fresh-curd", price: 60, stock: 150, categoryId: dairy.id, imageUrl: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400" },
    { name: "Cow Butter", slug: "cow-butter", price: 450, stock: 60, categoryId: dairy.id, imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400" },
  ];
  for (const p of productList) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, description: `Premium quality ${p.name}` } });
  }

  const cowList = [
    { name: "Kamdhenu", breed: "Gir", age: 5, adoptionFee: 3000, status: CowStatus.AVAILABLE, imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400" },
    { name: "Gauri", breed: "Sahiwal", age: 3, adoptionFee: 2500, status: CowStatus.AVAILABLE, imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400" },
    { name: "Nandini", breed: "Red Sindhi", age: 7, adoptionFee: 3500, status: CowStatus.AVAILABLE, imageUrl: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400" },
  ];
  for (const cow of cowList) {
    const ex = await prisma.cow.findFirst({ where: { name: cow.name } });
    if (!ex) await prisma.cow.create({ data: { ...cow, description: `${cow.breed} cow` } });
  }

  // Generic coupons
  await prisma.coupon.upsert({ where: { code: "WELCOME10" }, update: {}, create: { code: "WELCOME10", description: "10% off first order", discountType: DiscountType.PERCENTAGE, discountValue: 10, minOrderAmount: 200, isActive: true } });
  await prisma.coupon.upsert({ where: { code: "SAVE100" }, update: {}, create: { code: "SAVE100", description: "Flat 100 off", discountType: DiscountType.FLAT, discountValue: 100, minOrderAmount: 500, isActive: true } });

  // Promoters + their coupons
  const priya = await prisma.promoter.upsert({ where: { email: "priya@example.com" }, update: {}, create: { name: "Priya Sharma", email: "priya@example.com", notes: "Instagram - 50k followers" } });
  await prisma.coupon.upsert({ where: { code: "PRIYA15" }, update: {}, create: { code: "PRIYA15", description: "15% off via Priya", discountType: DiscountType.PERCENTAGE, discountValue: 15, minOrderAmount: 300, promoterId: priya.id, isActive: true } });

  const rahul = await prisma.promoter.upsert({ where: { email: "rahul@example.com" }, update: {}, create: { name: "Rahul Verma", email: "rahul@example.com", notes: "YouTube - organic farming" } });
  await prisma.coupon.upsert({ where: { code: "RAHUL20" }, update: {}, create: { code: "RAHUL20", description: "20% off via Rahul", discountType: DiscountType.PERCENTAGE, discountValue: 20, minOrderAmount: 500, promoterId: rahul.id, isActive: true, maxUses: 100 } });

  console.log("Seeding complete");
  console.log("Test coupons: WELCOME10 | SAVE100 | PRIYA15 | RAHUL20");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

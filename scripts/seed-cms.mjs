// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const INITIAL_TEAM = [
  {
    name: "Eki Eboigbe",
    role: "Festival Curator",
    bio: "Eki brings over a decade of experience in curating contemporary African art, bridging the gap between ancestral heritage and modern expression.",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
    order: 0,
  },
  {
    name: "Osasere Igbinovia",
    role: "Head of Exhibitions",
    bio: "With a keen eye for spatial design, Osasere transforms ordinary venues into immersive cultural landscapes that tell the story of Benin.",
    imageUrl: "https://images.unsplash.com/photo-1542596594-649edbc13630?w=800&q=80",
    order: 1,
  },
  {
    name: "Adesuwa Omoregie",
    role: "Literary Director",
    bio: "Adesuwa curates the voices of BAABFEST, championing emerging and established African authors to foster thought-provoking dialogue.",
    imageUrl: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&q=80",
    order: 2,
  },
  {
    name: "Nosa Igbinedion",
    role: "Operations Lead",
    bio: "The backbone of the festival, Nosa ensures seamless execution across all events, blending logistical precision with a passion for the arts.",
    imageUrl: "https://images.unsplash.com/photo-1506803682981-6e718a9def30?w=800&q=80",
    order: 3,
  },
];

async function seed() {
  console.log("Seeding CMS initial data...");

  // 1. Admin User
  const existingAdmin = await prisma.adminUser.findFirst();
  if (!existingAdmin) {
    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@baabfest.com";
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "baabfest2026";
    await prisma.adminUser.create({
      data: {
        email: defaultEmail,
        password: hashPassword(defaultPassword),
      },
    });
    console.log(`✅ Default admin created: Email: ${defaultEmail} | Password: ${defaultPassword}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${existingAdmin.email}`);
  }

  // 2. Team Members
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    for (const member of INITIAL_TEAM) {
      await prisma.teamMember.create({ data: member });
    }
    console.log(`✅ Created ${INITIAL_TEAM.length} initial team members.`);
  } else {
    console.log(`ℹ️ Team members already exist (${teamCount} found).`);
  }

  await prisma.$disconnect();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});

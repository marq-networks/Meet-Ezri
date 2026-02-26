
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.profiles.findFirst();
    if (profile) {
      console.log('Found profile:', profile.id);
    } else {
      console.log('No profiles found.');
    }
  } catch (e) {
    console.error(e);
  }
}

main();

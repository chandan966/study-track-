import prisma from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({ where: { studentId: null } });
  console.log(`Found ${users.length} users needing a 12-digit studentId.`);

  for (const user of users) {
    const studentId =
      user.email === "demo@example.com"
        ? "202611140001"
        : "2026" + Math.floor(10000000 + Math.random() * 90000000).toString();

    await prisma.user.update({
      where: { id: user.id },
      data: { studentId },
    });
    console.log(`Assigned 12-digit studentId ${studentId} to ${user.email}`);
  }
}

main()
  .then(() => {
    console.log("Backfill complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });

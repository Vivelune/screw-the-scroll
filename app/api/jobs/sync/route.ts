import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchArbeitnowJobs } from "@/lib/sources/arbeitnow";
import { fetchAdzunaJobs } from "@/lib/sources/adzuna";
import prisma from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [arbeitnowJobs, adzunaJobs] = await Promise.all([
    fetchArbeitnowJobs().catch(() => []),
    fetchAdzunaJobs().catch(() => []),
  ]);

  const allJobs = [...arbeitnowJobs, ...adzunaJobs];

  let created = 0;
  for (const job of allJobs) {
    const result = await prisma.jobListing.upsert({
      where: { source_externalId: { source: job.source, externalId: job.externalId } },
      update: {}, // if it already exists, don't touch it
      create: job,
    });
    if (result) created++;
  }

  return NextResponse.json({ total: allJobs.length, processed: created });
}
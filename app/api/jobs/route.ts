import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const visaOnly = searchParams.get("visaOnly") === "true";

  const jobs = await prisma.jobListing.findMany({
    where: visaOnly ? { visaSponsor: true } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(jobs);
}
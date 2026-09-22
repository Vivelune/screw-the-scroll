import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const job = await prisma.jobListing.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const application = await prisma.application.create({
    data: {
      userId,
      company: job.company,
      role: job.title,
      jobUrl: job.url,
      location: job.location,
      stage: "WISHLIST",
    },
  });

  return NextResponse.json(application, { status: 201 });
}
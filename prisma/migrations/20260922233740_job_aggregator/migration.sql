-- CreateTable
CREATE TABLE "JobListing" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "country" TEXT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "visaSponsor" BOOLEAN NOT NULL DEFAULT false,
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobListing_source_externalId_key" ON "JobListing"("source", "externalId");

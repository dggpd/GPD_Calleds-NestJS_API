-- CreateEnum
CREATE TYPE "CalledType" AS ENUM ('COMPUTER_ISSUE', 'SOFTWARE_ISSUE', 'PERIPHERAL_ISSUE', 'PRINT_ISSUE', 'NETWORK_ACCESS_ISSUE', 'INTERNET_ACCESS_ISSUE');

-- CreateEnum
CREATE TYPE "CalledStatus" AS ENUM ('PENDING', 'OPENED', 'NO_ANSWER', 'CANCELED', 'RESOLVED', 'NO_SOLUTION');

-- CreateEnum
CREATE TYPE "CalledDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "name" TEXT NOT NULL,
    "sector" VARCHAR(16) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "called" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "type" "CalledType" NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "status" "CalledStatus" NOT NULL DEFAULT 'PENDING',
    "code" VARCHAR(24),
    "difficulty" "CalledDifficulty",
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "called_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");

-- CreateIndex
CREATE INDEX "user_cpf_idx" ON "user"("cpf");

-- CreateIndex
CREATE INDEX "called_authorId_idx" ON "called"("authorId");

-- AddForeignKey
ALTER TABLE "called" ADD CONSTRAINT "called_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

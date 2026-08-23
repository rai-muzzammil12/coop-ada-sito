-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL DEFAULT 'supporto',
    "image" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "logoUrl" TEXT NOT NULL DEFAULT '/images/logo.jpg',
    "heroImage" TEXT NOT NULL DEFAULT '/images/hero-home.jpg',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'PAGINA 1  •  HOME',
    "heroTitleLine1" TEXT NOT NULL DEFAULT 'Costruiamo valore',
    "heroTitleLine2" TEXT NOT NULL DEFAULT 'insieme.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'La serenità di una cura qualificata per i tuoi cari.',
    "heroBody" TEXT NOT NULL DEFAULT 'Offriamo servizi di assistenza alla persona flessibili, personalizzati e a misura della tua famiglia — sollevandoti da ogni pensiero burocratico.',
    "phone" TEXT NOT NULL DEFAULT '+39 3928542330',
    "email" TEXT NOT NULL DEFAULT 'coopada.so@gmail.com',
    "address" TEXT NOT NULL DEFAULT 'Sede Operativa: Ponte in Valtellina, via Moltoni 23, CAP 23026',
    "partitaIva" TEXT NOT NULL DEFAULT '13460630018',
    "appointmentsNote" TEXT NOT NULL DEFAULT 'Riceviamo solo su appuntamento',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

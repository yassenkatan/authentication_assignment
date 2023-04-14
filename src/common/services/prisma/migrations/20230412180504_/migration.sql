-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "userRole" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "hashRefreshToken" TEXT,
    "otpCode" INTEGER,
    "otpCodeExpireDate" BIGINT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productId" TEXT,

    CONSTRAINT "userProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "images" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- AddForeignKey
ALTER TABLE "userProduct" ADD CONSTRAINT "userProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProduct" ADD CONSTRAINT "userProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

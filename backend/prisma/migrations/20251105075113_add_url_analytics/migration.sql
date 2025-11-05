-- AlterTable
ALTER TABLE "Urls" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UrlAnalytics" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "accessAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlAnalytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UrlAnalytics" ADD CONSTRAINT "UrlAnalytics_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

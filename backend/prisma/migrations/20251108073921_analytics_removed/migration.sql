/*
  Warnings:

  - You are about to drop the `UrlAnalytics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UrlAnalytics" DROP CONSTRAINT "UrlAnalytics_urlId_fkey";

-- DropTable
DROP TABLE "public"."UrlAnalytics";

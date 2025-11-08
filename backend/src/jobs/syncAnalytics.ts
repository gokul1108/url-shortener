import cron from "node-cron";
import redisClient from "../config/redis.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type RedisExecResult = [Error | null, string | null][];

// Fetch data from Redis and store it in the database
(async () => {
  try {
    console.log("Sync clicks");
    const keys = await redisClient.keys("clicks:*");
    if (keys.length === 0) {
      console.log("No clicks to sync");
    }

    const result = await redisClient
      .pipeline(keys.map((key) => ["get", key]))
      .exec();
    const updates = keys.reduce<{ shortId: string; clicks: number }[]>(
      (acc, key, index) => {
        if (!result) return acc;
        const entry = result[index];

        if (!entry) return acc;
        const [err, value] = entry;
        if (err || typeof value !== "string") return acc;

        const shortId = key.split(":")[1] as string;
        const clicks = parseInt(value, 10);

        if (!Number.isNaN(clicks)) acc.push({ shortId, clicks });

        return acc;
      },
      []
    );

    console.log("Updating database with clicks:", updates);
    await prisma.$transaction(
      updates.map(({ shortId, clicks }) =>
        prisma.urls.update({
          where: { shortId },
          data: { clickCount: { increment: clicks } },
        })
      )
    );
  } catch (error) {
    console.log("Error syncing clicks:", error);
  }
})();

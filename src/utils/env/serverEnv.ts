import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_ALLOWED_CHANNELS: z.string().min(1),
    DISCORD_BOT_ERROR_LOGS_CHANNEL_ID: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});

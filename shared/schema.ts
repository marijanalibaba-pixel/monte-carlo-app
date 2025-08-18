import { z } from "zod";

// Basic schema for Monte Carlo application
export const forecastConfigSchema = z.object({
  backlogSize: z.number().min(1),
  trials: z.number().min(100).max(10000),
  startDate: z.string().transform((str) => new Date(str)),
});

export type ForecastConfig = z.infer<typeof forecastConfigSchema>;
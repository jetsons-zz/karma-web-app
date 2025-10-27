import { z } from "zod";

export const DecisionCard = z.object({
  decision_id: z.string(),
  goal: z.string(),
  context_ref: z.string(),
  alternatives: z.array(z.object({
    id: z.string(),
    actions: z.array(z.string()),
    assumptions: z.array(z.string()).optional()
  })),
  simulation: z.object({
    engine: z.literal("jantra.v1"),
    results: z.array(z.object({
      alt: z.string(),
      roi: z.number(),
      risk: z.number(),
      runway_months: z.number()
    }))
  }).optional(),
  recommendation: z.string(),
  hitl_required: z.boolean(),
  expires_at: z.string()
});

export const TaskSession = z.object({
  session_id: z.string(),
  project_id: z.string(),
  owner_avatar: z.string(),
  goals: z.array(z.string()),
  mode: z.enum(["auto","manual"]),
  hitl_checkpoints: z.array(z.string()).default([]),
  status: z.enum(["running","paused","done","failed"]),
  telemetry: z.object({
    parallel_tasks: z.number().int().nonnegative(),
    night_run: z.boolean()
  })
});

export const Avatar = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["Forge", "Vision", "Scout", "Capital", "Flow", "One"]),
  status: z.enum(["online", "busy", "offline"]),
  training_progress: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  subscribers: z.number().int().nonnegative()
});

export const Project = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["active", "paused", "completed"]),
  progress: z.number().min(0).max(100),
  assigned_avatars: z.array(z.string()),
  parallel_tasks: z.number().int().nonnegative(),
  bottleneck: z.string().optional()
});

export const StoreAvatar = z.object({
  avatar_id: z.string(),
  name: z.string(),
  priceMonthly: z.number().positive(),
  rating: z.number().min(0).max(5),
  subscribers: z.number().int().nonnegative(),
  trial_days: z.number().int().default(7),
  capabilities: z.array(z.string())
});

export const EconomyData = z.object({
  period: z.string(), // "2025-01"
  consumer_savings: z.number(),
  producer_revenue: z.number(),
  net_gain: z.number(),
  goals: z.object({
    savings_target: z.number(),
    revenue_target: z.number()
  })
});

export type DecisionCardType = z.infer<typeof DecisionCard>;
export type TaskSessionType = z.infer<typeof TaskSession>;
export type AvatarType = z.infer<typeof Avatar>;
export type ProjectType = z.infer<typeof Project>;
export type StoreAvatarType = z.infer<typeof StoreAvatar>;
export type EconomyDataType = z.infer<typeof EconomyData>;

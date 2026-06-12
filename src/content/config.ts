import { defineCollection, z } from 'astro:content';

const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  pain: z.string().optional(),
});

const integrationSchema = z.object({
  title: z.string(),
  description: z.string(),
  framework: z.string(),
  pain: z.string(),
  stackblitz: z.string().optional(),
});

export const collections = {
  guide: defineCollection({ type: 'content', schema: guideSchema }),
  integrations: defineCollection({ type: 'content', schema: integrationSchema }),
};

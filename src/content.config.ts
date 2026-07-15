import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	events: defineCollection({
		loader: glob({ pattern: '*/*/*.md', base: './src/events' }),
		schema: z.object({
			title: z.string(),
			date: z.coerce.date(),
			startTime: z.string(),
			endTime: z.string(),
			location: z.string().optional(),
			description: z.string().optional(),
			category: z.enum(['meeting', 'workshop', 'social', 'deadline']).optional(),
		}),
	}),
};

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
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
	issues: defineCollection({
		loader: glob({ pattern: '*/*/*.md', base: './src/issues' }),
		schema: z.object({
			title: z.string(),
			date: z.coerce.date(),
			status: z.enum(['open', 'in-progress', 'resolved', 'closed']),
			priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
			category: z.enum(['it-problem', 'app-problem', 'feature-request', 'doc-request', 'other']).optional(),
			reporter: z.string().optional(),
			assignee: z.string().optional(),
			dueDate: z.string().optional(),
			tags: z.array(z.string()).optional(),
			description: z.string().optional(),
			resolvedDate: z.string().optional(),
			resolvedBy: z.string().optional(),
			resolutionType: z.enum(['fixed', 'wont-fix', 'duplicate', 'workaround', 'by-design']).optional(),
		}),
	}),
};

import * as v from 'valibot';

export const BoxCreateSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(50)),
  content: v.pipe(v.string(), v.maxLength(200)),
  solution: v.pipe(v.string(), v.toLowerCase(), v.maxLength(200)),
  difficulty: v.optional(v.pipe(v.number(), v.minLength(1), v.maxLength(5))),
  tags: v.optional(v.array(v.pipe(v.string(), v.trim(), v.minLength(3), v.maxLength(20)))),
});

export const SolveBoxSchema = v.object({
  solution: v.pipe(v.string(), v.toLowerCase(), v.maxLength(200)),
});
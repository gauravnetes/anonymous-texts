import z from 'zod'

export const acceptsMessageSchema = z.object({
    acceptsMessage: z.boolean()
})


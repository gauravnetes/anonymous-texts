import z from 'zod'

export const messageSchema = z.object({
    content: z.string()
                .min(10, "Content Must be atleast of 10 characters")
                .max(300, "Content Must not be longer than 300 characters")
})


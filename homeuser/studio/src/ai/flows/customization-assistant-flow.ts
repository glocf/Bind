'use server';
/**
 * @fileOverview An AI assistant to help with profile customization.
 * 
 * - customizationAssistant - A function that provides customization advice.
 * - CustomizationAssistantInput - The input type for the assistant.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const CustomizationAssistantInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for customization advice.'),
  profile: z.object({
    username: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    accent_color: z.string().nullable().optional(),
  }).describe('A summary of the user\'s current profile for context.'),
});

export type CustomizationAssistantInput = z.infer<typeof CustomizationAssistantInputSchema>;

const assistantPrompt = ai.definePrompt({
    name: 'customizationAssistantPrompt',
    input: { schema: CustomizationAssistantInputSchema },
    prompt: `You are a friendly and creative profile customization assistant for a platform called "Bind".
Your goal is to help users make their profile look amazing and reflect their personality.

You can provide suggestions for:
- Bios: Make them more engaging, fun, or professional.
- Color Palettes: Suggest appealing color combinations (accent, background, text).
- Background Ideas: Give ideas for background images based on the user's bio or interests.
- General Style: Give tips on how to combine different customization options.

Here is the user's current profile information for context:
- Username: {{profile.username}}
- Bio: "{{profile.bio}}"
- Current Accent Color: {{profile.accent_color}}

Here is the user's request:
"{{{prompt}}}"

Please provide a helpful and encouraging response. Be specific with your suggestions. For colors, provide hex codes.
Keep your responses concise and easy to read, using markdown for formatting if needed.`,
});


export async function customizationAssistant(input: CustomizationAssistantInput): Promise<string> {
    const { output } = await assistantPrompt(input);
    return output || "I'm sorry, I couldn't come up with a suggestion right now. Please try a different question!";
}

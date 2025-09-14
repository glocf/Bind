'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating themed profile background designs based on a user's bio.
 *
 * The flow takes a user bio as input and uses it to generate a background image.
 * - generateThemedProfileBackground - The function that initiates the profile background generation.
 * - GenerateThemedProfileBackgroundInput - The input type for the generateThemedProfileBackground function.
 * - GenerateThemedProfileBackgroundOutput - The return type for the generateThemedProfileBackground function, which includes the data URI of the generated image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateThemedProfileBackgroundInputSchema = z.object({
  bio: z
    .string()
    .describe('The user bio used to generate the profile background.'),
});

export type GenerateThemedProfileBackgroundInput = z.infer<
  typeof GenerateThemedProfileBackgroundInputSchema
>;

const GenerateThemedProfileBackgroundOutputSchema = z.object({
  backgroundImageDataUri: z
    .string()
    .describe(
      'The generated background image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});

export type GenerateThemedProfileBackgroundOutput = z.infer<
  typeof GenerateThemedProfileBackgroundOutputSchema
>;

export async function generateThemedProfileBackground(
  input: GenerateThemedProfileBackgroundInput
): Promise<GenerateThemedProfileBackgroundOutput> {
  return generateThemedProfileBackgroundFlow(input);
}

const generateThemedProfileBackgroundPrompt = ai.definePrompt({
  name: 'generateThemedProfileBackgroundPrompt',
  input: {schema: GenerateThemedProfileBackgroundInputSchema},
  output: {schema: GenerateThemedProfileBackgroundOutputSchema},
  prompt: `Given the following user bio, generate a visually appealing background image that reflects the user\'s personality and interests. The image should be in a style suitable for a profile background. Return the image as a data URI.

User Bio: {{{bio}}}

Background Image: {{media url=backgroundImageDataUri}}`,
});

const generateThemedProfileBackgroundFlow = ai.defineFlow(
  {
    name: 'generateThemedProfileBackgroundFlow',
    inputSchema: GenerateThemedProfileBackgroundInputSchema,
    outputSchema: GenerateThemedProfileBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a profile background image based on this user bio: ${input.bio}`,
    });

    return {backgroundImageDataUri: media!.url};
  }
);

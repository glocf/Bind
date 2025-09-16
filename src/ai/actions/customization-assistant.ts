
'use server';

import { customizationAssistantFlow, type CustomizationAssistantInput } from "@/ai/flows/customization-assistant-flow";

export async function customizationAssistant(input: CustomizationAssistantInput): Promise<string> {
    return await customizationAssistantFlow(input);
}

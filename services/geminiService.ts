import { GoogleGenAI, Modality } from "@google/genai";
import { ImageFile, ProductCategory } from "../types";

// Ensure API_KEY is available in the environment
if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getPromptForCategory = (category: ProductCategory, userPrompt?: string): string => {
    let basePrompt = '';
    switch (category) {
        case 'clothing':
            basePrompt = `Taking the person from the first image and the clothing item from the second image, realistically and seamlessly place the clothing item onto the person. The final image should only show the person wearing the new clothing. Maintain the original pose and background.`;
            break;
        case 'necklace':
            basePrompt = `Taking the person from the first image and the necklace from the second image, realistically place the necklace around the person's neck. The final image should be a clear, close-up view of the person's neck and chest area, showcasing the necklace. Maintain the original lighting.`;
            break;
        case 'earrings':
            basePrompt = `Taking the person from the first image and the earring from the second image, realistically place the earring on the person's ear. If only one earring is provided, place it on the most visible ear. The final image should be a clear, close-up view of the side of the person's head, focusing on the ear and the earring.`;
            break;
        case 'shoes':
            basePrompt = `Taking the person from the first image and the pair of shoes from the second image, realistically place the shoes on the person's feet. The final image should be a clear, close-up view of the person's lower legs and feet, showcasing the shoes. Ensure the shoes fit the feet correctly.`;
            break;
        case 'scarf':
            basePrompt = `Taking the person from the first image and the scarf from the second image, realistically drape the scarf over the person's head and shoulders in a stylish way. The final image should be a clear view of the person's head and upper body, showcasing the scarf. Maintain the original pose and background.`;
            break;
        case 'bag':
            basePrompt = `Taking the person from the first image and the bag from the second image, realistically place the bag in the person's hand or over their shoulder, in a natural way that fits the bag type (e.g., handbag in hand, crossbody over shoulder). The final image should clearly show the person with the bag. Maintain the original pose and background.`;
            break;
        default:
            basePrompt = `Place the item from the second image onto the person in the first image appropriately.`;
    }
    return userPrompt ? `${basePrompt} ${userPrompt}` : basePrompt;
}

export const generateVirtualTryOn = async (
    mannequin: ImageFile,
    product: ImageFile,
    category: ProductCategory,
    userPrompt?: string
): Promise<string> => {
    try {
        const prompt = getPromptForCategory(category, userPrompt);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: mannequin.base64, mimeType: mannequin.mimeType } },
                    { inlineData: { data: product.base64, mimeType: product.mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        } else {
            const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
            if(textPart?.text) {
                 throw new Error(`AI returned text instead of an image: ${textPart.text}`);
            }
            throw new Error("AI did not return an image. The response may have been blocked.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("An error occurred while generating the image. Please check the console for details.");
    }
};
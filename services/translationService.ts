import { GoogleGenAI, Type } from "@google/genai";
import { FullTranslationConfig, TranslationJob, TranslationResult } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getValuesToTranslate = (obj: any): { path: (string | number)[]; value: string }[] => {
    const items: { path: (string | number)[]; value:string }[] = [];
    const walk = (current: any, path: (string | number)[]) => {
        if (typeof current === 'string') {
            items.push({ path, value: current });
        } else if (typeof current === 'object' && current !== null) {
            if (Array.isArray(current)) {
                current.forEach((item, index) => walk(item, [...path, index]));
            } else {
                Object.keys(current).forEach(key => walk(current[key], [...path, key]));
            }
        }
    };
    walk(obj, []);
    return items;
};

const updateObjectByPath = (obj: any, path: (string | number)[], value: string) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    return obj;
};

const buildPrompt = (chunk: { [key: string]: string }, languageName: string, config: FullTranslationConfig): string => {
    let prompt = `Translate the JSON values to ${languageName}. Respond with only a valid JSON object containing the translated values, maintaining the original keys. Do not translate the keys.

JSON to translate:
${JSON.stringify(chunk, null, 2)}
`;

    const rules: string[] = [];
    if (config.preserveFormatting) rules.push("Preserve formatting (like HTML, Markdown).");
    if (config.preserveCase) rules.push("Preserve original letter casing.");
    if (config.excludeNumbers) rules.push("Do not translate numbers or strings containing only numbers.");

    if (rules.length > 0) {
        prompt += "\n\nTranslation Rules:\n- " + rules.join("\n- ");
    }
    
    prompt += `\n\nTranslation Style: ${config.style}, Tone: ${config.tone}, Creativity: ${config.creativity}.`;

    if (config.customInstructions) {
        prompt += `\n\nSpecial Instructions: ${config.customInstructions}`;
    }

    if (config.glossary) {
        prompt += `\n\nGlossary (term:translation):\n${config.glossary}`;
    }
    
    return prompt;
};

const translateChunk = async (chunk: { [key: string]: string }, languageName: string, config: FullTranslationConfig, retries = 3): Promise<any> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = buildPrompt(chunk, languageName, config);
        
        // FIX: Use responseSchema to enforce JSON output structure.
        const schemaProperties = Object.keys(chunk).reduce((acc, key) => {
            acc[key] = { type: Type.STRING };
            return acc;
        }, {} as Record<string, { type: Type }>);

        const responseSchema = {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: Object.keys(chunk),
        };

        const response = await ai.models.generateContent({
            model: config.model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: config.creativity,
            }
        });
        
        const textResponse = response.text.trim();
        return JSON.parse(textResponse);
    } catch (error: any) {
        if (retries > 0) {
            console.warn(`Translation attempt failed. Retrying in 2 seconds... (${retries} retries left)`);
            await delay(2000);
            return translateChunk(chunk, languageName, config, retries - 1);
        }
        console.error("Translation failed after multiple retries:", error);
        throw new Error(`API Error: ${error.message || 'Failed to translate chunk.'}`);
    }
};


export const processTranslationQueue = async (
    jobs: TranslationJob[], 
    config: FullTranslationConfig, 
    onProgress: (progress: { percentage: number; message: string }) => void
): Promise<TranslationResult[]> => {
    const totalJobs = jobs.length;
    const allResults: TranslationResult[] = [];

    for (let i = 0; i < totalJobs; i++) {
        const job = jobs[i];
        const { file, language } = job;
        const messagePrefix = `Translating ${file.name} to ${language.name} (${i + 1}/${totalJobs})`;
        onProgress({ percentage: (i / totalJobs) * 100, message: messagePrefix });

        try {
            const valuesToTranslate = getValuesToTranslate(file.parsedJson);
            const chunks = [];
            for (let j = 0; j < valuesToTranslate.length; j += config.chunkSize) {
                chunks.push(valuesToTranslate.slice(j, j + config.chunkSize));
            }

            let translatedJson = JSON.parse(JSON.stringify(file.parsedJson)); // Deep copy
            
            for (let k = 0; k < chunks.length; k++) {
                const chunkItems = chunks[k];
                const chunkObject = chunkItems.reduce((acc, item, index) => {
                    // Use a unique key to avoid conflicts and simplify mapping back
                    acc[`val_${index}`] = item.value;
                    return acc;
                }, {} as { [key: string]: string });

                onProgress({ 
                    percentage: ((i + (k / chunks.length)) / totalJobs) * 100, 
                    message: `${messagePrefix} - Chunk ${k + 1}/${chunks.length}` 
                });

                const translatedChunk = await translateChunk(chunkObject, language.name, config);

                Object.keys(translatedChunk).forEach((key, index) => {
                    const originalItem = chunkItems[index];
                    if (originalItem) {
                        translatedJson = updateObjectByPath(translatedJson, originalItem.path, translatedChunk[key]);
                    }
                });
            }

            allResults.push({
                fileName: file.name,
                languageCode: language.code,
                translatedJson: translatedJson,
            });
        } catch (error) {
            console.error(`Failed to translate ${file.name} to ${language.name}:`, error);
            // Optionally, you can decide to stop or continue on error. Here we continue.
        }
    }

    onProgress({ percentage: 100, message: 'All translations complete!' });
    return allResults;
};

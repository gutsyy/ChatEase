export const openAIPricing = {
  "gpt-3.5-turbo": 0.002,
  "gpt-4": 0.03,
};

export type OpenAIModels = keyof typeof openAIPricing;

export const openAIModels = Object.keys(openAIPricing) as OpenAIModels[];

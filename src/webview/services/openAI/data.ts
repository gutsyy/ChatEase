export const openAIPricing = {
  "gpt-3.5-turbo": 0.002,
  "gpt-3.5-turbo-16k": 0.004,
  "gpt-3.5-turbo-0613": 0.002,
  "gpt-3.5-turbo-16k-0613": 0.004,
  "gpt-4": 0.06,
  "gpt-4-0613": 0.06,
  "gpt-4-32k": 0.12,
  "gpt-4-32k-0613": 0.12,
  "gpt-4o": 0.03,
  "gpt-4o-2024-05-13": 0.03,
};

export type OpenAIModels = keyof typeof openAIPricing;

export const openAIModels = Object.keys(openAIPricing) as OpenAIModels[];

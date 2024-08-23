export const openAIPricing = {
  "gpt-4o-mini-2024-07-18": 0,
  "gpt-4o-2024-08-06": 0,
  "claude-3-5-sonnet-20240620": 0,
  "claude-3-haiku-20240307": 0
};

export type OpenAIModels = keyof typeof openAIPricing;

export const openAIModels = Object.keys(openAIPricing) as OpenAIModels[];

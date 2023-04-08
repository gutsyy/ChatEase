export type SettingsKey = keyof Settings;

export interface Settings {
  v2ray: boolean;
  http_proxy: boolean;
  http_proxy_host: string;
  http_proxy_port: string;
  http_proxy_username: string;
  http_proxy_password: string;
  language: "en" | "zh";
  open_api_key: string;
  max_messages_num: number;
  openai_api_origin: string;
  max_tokens: number;
  stream_enable: boolean;
  markdown_code_scope: string;
  chat_input_toolbar_items: any[];
  message_toolbar_items: any[];
  temperature: number;
  theme: "light" | "dark";
  fontSize: string;
}

export type SettingsType<K extends SettingsKey> = Settings[K];

const defaultSettings: Settings = {
  v2ray: false,
  http_proxy: false,
  http_proxy_host: "",
  http_proxy_port: "",
  http_proxy_username: "",
  http_proxy_password: "",
  language: "zh",
  open_api_key: "",
  max_messages_num: 6,
  openai_api_origin: "https://api.openai.com/",
  max_tokens: 3000,
  stream_enable: true,
  markdown_code_scope: "JavaScript,TypeScript,HTML,CSS,JSON,Python,Markdown",
  chat_input_toolbar_items: [],
  message_toolbar_items: [],
  temperature: 1,
  theme: "light",
  fontSize: "18",
};

export { defaultSettings };

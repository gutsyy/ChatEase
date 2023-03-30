export type SettingsKey =
  | "v2ray"
  | "http_proxy"
  | "http_proxy_host"
  | "http_proxy_port"
  | "http_proxy_username"
  | "http_proxy_password"
  | "language"
  | "open_api_key"
  | "max_messages_num"
  | "openai_api_origin"
  | "max_tokens"
  | "stream_enable"
  | "markdown_code_scope"
  | "chat_input_toolbar_items"
  | "message_toolbar_items"
  | "temperature";

const defaultSettings: {
  [key in SettingsKey]: string | number | boolean | number[];
} = {
  v2ray: false,
  http_proxy: false,
  http_proxy_host: "",
  http_proxy_port: "",
  http_proxy_username: "",
  http_proxy_password: "",
  language: "zh-CN",
  open_api_key: "",
  max_messages_num: 6,
  openai_api_origin: "https://api.openai.com/v1/chat/completions",
  max_tokens: 3000,
  stream_enable: true,
  markdown_code_scope: "JavaScript,TypeScript,HTML,CSS,JSON,Python,Markdown",
  chat_input_toolbar_items: [],
  message_toolbar_items: [],
  temperature: 1,
};

export { defaultSettings };

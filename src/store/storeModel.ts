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
  | "stream_enable";

const defaultSettings = {
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
  max_tokens: 4000,
  stream_enable: true,
};

export { defaultSettings };

import { AxiosRequestConfig } from "axios";

export type PostRequest = {
  url: string;
  body: any;
  // https proxy settings
  httpsProxy?: {
    host: string;
    port: number;
  };
  config: AxiosRequestConfig;
};

export type replyAxiosResponse = any;

export type V2rayCommandReplyData = { running: boolean; error?: string };

export type NotificationData = {
  title: string;
  message: string;
  type: "success" | "warning" | "error";
};

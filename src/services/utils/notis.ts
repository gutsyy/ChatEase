import { NotificationProps, notifications } from "@mantine/notifications";

export interface NotiMessage {
  title: string;
  message: string;
  type: "success" | "warning" | "error";
}

const show = (props: NotificationProps) => {
  notifications.show({ ...props });
};

const success = (title: string, msg: string) => {
  notifications.show({
    autoClose: 3000,
    title: title,
    message: msg,
    withCloseButton: true,
    color: "green",
  });
};

const warning = (title: string, msg: string) => {
  notifications.show({
    autoClose: 3000,
    title: title,
    message: msg,
    withCloseButton: true,
    color: "orange",
  });
};

const error = (title: string, msg: string) => {
  notifications.show({
    autoClose: 3000,
    title: title,
    message: msg,
    withCloseButton: true,
    color: "red",
  });
};

const handleNotis = (notiMessage: NotiMessage) => {
  if (notiMessage.type === "success") {
    success(notiMessage.title, notiMessage.message);
  }
  // error
  else if (notiMessage.type === "error") {
    error(notiMessage.title, notiMessage.message);
  }
  // warning
  else {
    warning(notiMessage.title, notiMessage.message);
  }
};

export { show, success, warning, error, handleNotis };

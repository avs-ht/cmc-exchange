import { getDateFromMessage } from "$/widgets/Chat/lib/message";

export const generateImageName = (url: string) => {
  const isVideo = url.includes("data:video/");
  const extenstion = isVideo
    ? url.match(/data:video\/(\w+);base64,.*$/)?.[1]
    : url.match(/data:image\/(\w+);base64,.*$/)?.[1];
  return `${(Math.random() + 1).toString(36).substring(7)}.${extenstion}`;
};

export const generateDateForOpenedImage = (datetime: string) => {
  return new Date(getDateFromMessage(datetime))
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    })
    .replace(" в ", ", ");
};

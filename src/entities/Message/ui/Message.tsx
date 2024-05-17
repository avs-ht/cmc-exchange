import { useState } from "react";

import { formatBase64Url } from "../lib/base64";

import clsx from "$/shared/helpers/clsx";
import { Message as MessageType } from "$/shared/types/api/enitites";
import Modal from "$/shared/ui/modals/Modal";
import { CurrencyIcon } from "$/shared/ui/other/CurrencyIcon";
import styles from "./Message.module.scss";
import { OpenedImage } from "./OpenedImage/OpenedImage";
import userIcon from "./images/user.svg";
import { VideoMessage } from "./VideoMessage/VideoMessage";

interface Props {
  message: MessageType;
}

export const Message = ({ message }: Props) => {
  const [openedImage, setOpenedImage] = useState<OpenedImage | undefined>();
  const isSupport = message.side === "SUPPORT";
  const messageContainerClassName = clsx(
    styles.messageContainer,
    { [styles.support]: isSupport },
    []
  );

  const isVideo = message.image?.includes("data:video");

  return (
    <div className={messageContainerClassName}>
      <div className={styles.left}>
        {!isSupport ? (
          <CurrencyIcon
            currencyName={message.nick_name}
            imageUrl={userIcon}
            width={40}
            dev
          />
        ) : (
          <div className={styles.supportIcon}>T</div>
        )}
      </div>
      <div className={styles.message}>
        <div className={styles.messageHeader}>
          <h3 className={styles.nickName}>{message.nick_name}</h3>
          <span className={styles.time}>
            {message.dt?.split(" ")[1]?.slice(0, -3)}
          </span>
        </div>
        <p className={styles.messageText}>
          {!message.image ? (
            message.text
          ) : (
            <button
              className={styles.mediaButton}
              onClick={() => {
                setOpenedImage({
                  url: formatBase64Url(message.image),
                  name: message.nick_name[0],
                  datetime: message.dt,
                  isVideo: isVideo,
                });
              }}
            >
              {isVideo ? (
                <VideoMessage base64={message.image} />
              ) : (
                <img
                  className={styles.messageImage}
                  src={formatBase64Url(message.image)}
                />
              )}
            </button>
          )}
        </p>
      </div>
      <Modal opened={openedImage !== undefined}>
        <OpenedImage
          url={openedImage?.url || ""}
          name={openedImage?.name || ""}
          datetime={openedImage?.datetime || ""}
          resetImageUrl={() => setOpenedImage(undefined)}
          isVideo={isVideo}
        />
      </Modal>
    </div>
  );
};

import { useEffect } from "react";

import { generateDateForOpenedImage, generateImageName } from "../../lib/image";
import userAvatar from "../images/user.svg";

import Page from "$/shared/ui/global/Page";
import { CurrencyIcon } from "$/shared/ui/other/CurrencyIcon";
import styles from "./OpenedImage.module.scss";
import closeIcon from "./images/close.svg";
import downloadIcon from "./images/download.svg";
import ReactPlayer from "react-player";

export interface OpenedImage {
  url: string;
  name: string;
  datetime: string;
  isSupport?: boolean;
  isVideo: boolean;
}
export const OpenedImage = (
  props: OpenedImage & { resetImageUrl: () => void }
) => {
  const { url, name, datetime, resetImageUrl, isSupport, isVideo } = props;
  console.log(url);
  const formattedDate = generateDateForOpenedImage(datetime);
  useEffect(() => {
    const closeImage = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetImageUrl();
      }
    };
    document.body.addEventListener("keydown", closeImage);

    return () => document.body.removeEventListener("keydown", closeImage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.sender}>
            <div className={styles.avatar}>
              {isSupport ? (
                <div className={styles.supportIcon}>T</div>
              ) : (
                <CurrencyIcon
                  width={40}
                  currencyName={name}
                  imageUrl={userAvatar}
                  dev
                />
              )}
            </div>
            <div className={styles.senderInfo}>
              <span className={styles.senderName}>{name || "Аноним"}</span>
              <span className={styles.senderTime}>{formattedDate}</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <a
              className={styles.download}
              href={url}
              download={generateImageName(url)}
            >
              <img src={downloadIcon} alt="Скачать открытую фотографию" />
            </a>
            <button className={styles.close} onClick={resetImageUrl}>
              <img src={closeIcon} alt="Закрыть открытую фотографию" />
            </button>
          </div>
        </div>
        <div className={styles.body}>
          {isVideo ? (
            <ReactPlayer url={url} playing controls />
          ) : (
            <img src={url} alt={name} className={styles.image} />
          )}
        </div>
      </div>
    </Page>
  );
};

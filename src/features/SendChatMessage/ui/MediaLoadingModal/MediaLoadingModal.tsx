import styles from "./MediaLoadingModal.module.scss";
import Modal from "$/shared/ui/modals/Modal";
import ModalWindow from "$/shared/ui/modals/ModalWindow";
import { UploadIcon } from "./UploadIcon";

import { ProgressBar } from "primereact/progressbar";
import { useEffect, useRef, useState } from "react";
import { convertToBase64 } from "$/shared/helpers/convertToBase64";
import { orderAPI } from "$/shared/api/order";
import axios from "axios";
import Button from "$/shared/ui/kit/Button/Button";
import getCookieValue from "$/shared/helpers/getCookie";

interface Props {
  closeFunction: () => void;
  file: File;
}
const CLOSE_DELAY = 5000;
export const MediaLoadingModal = ({ closeFunction, file }: Props) => {
  const fileName =
    file.name.length < 25
      ? file.name
      : `${file.name.slice(0, 10)} ... ${file.name.slice(file.name.lastIndexOf("."), file.name.length)}`;

  const [value, setValue] = useState(0);
  const [status, setStatus] = useState<"done" | "error" | "loading">("loading");

  const timerRef = useRef<NodeJS.Timeout>();
  const closeWindow = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      closeFunction();
    }, CLOSE_DELAY);
  };
  const handleUpload = async () => {
    try {
      setStatus("loading");
      const formData = new FormData();
      const base64Url = await convertToBase64(file);
      formData.append("image", base64Url);
      formData.append("order_hash", getCookieValue("order_hash") || "");

      await axios.post(
        `${orderAPI.getAPILink()}/message/send_image`,
        formData,
        {
          onUploadProgress(progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100)
            );
            setValue(percentCompleted);
          },
        }
      );
      setStatus("done");
      closeWindow();
    } catch (error) {
      setStatus("error");
      closeWindow();
    }
  };

  useEffect(() => {
    if (!file) return;

    handleUpload();
  }, [file]);

  return (
    <Modal opened={true}>
      <ModalWindow icon={<UploadIcon />} windowClassName={styles.window}>
        <div className={styles.container}>
          {status === "loading" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
                <path d="m14 19.5 3-3 3 3" />
                <path d="M17 22v-5.5" />
                <circle cx="9" cy="9" r="2" />
              </svg>
              <div className={styles.info}>
                <h2>{fileName}</h2>
                <ProgressBar
                  color="var(--accentColor)"
                  value={value}
                  className={styles.progress}
                />
              </div>
              <button onClick={() => closeFunction()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <div className={styles.loadingEnded}>
                <h2>
                  {status === "done"
                    ? "Файл успешно загружен"
                    : "Произошла ошибка"}
                </h2>
                <p>
                  Окно закроется автоматически через {CLOSE_DELAY / 1000} сек.
                </p>
              </div>
              <Button onClick={closeFunction}>Закрыть окно</Button>
            </>
          )}
        </div>
      </ModalWindow>
    </Modal>
  );
};

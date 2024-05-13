import styles from "./MediaLoadingModal.module.scss";
import Modal from "$/shared/ui/modals/Modal";
import ModalWindow from "$/shared/ui/modals/ModalWindow";
import { UploadIcon } from "./UploadIcon";

import { ProgressBar } from "primereact/progressbar";
import { useEffect, useState } from "react";

interface Props {
  closeFunction: () => void;
  file: File;
}
export const MediaLoadingModal = ({ closeFunction, file }: Props) => {
  const [value, setValue] = useState();
  useEffect(() => {
    if (!file) 
  }, [file]);
  return (
    <Modal opened={true}>
      <ModalWindow icon={<UploadIcon />} windowClassName={styles.window}>
        <div className={styles.container}>
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
            <h2>{`${file.name.slice(0, 25)}${file.name.length > 25 ? "..." : ""}`}</h2>
            <ProgressBar
              color="var(--accentColor)"
              value={value}
              style={{ height: "25px", color: "var(--contrastColor)", }}
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
        </div>
      </ModalWindow>
    </Modal>
  );
};

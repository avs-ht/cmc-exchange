import clsx from "$/shared/helpers/clsx";
import { useExchangeSettings } from "$/shared/storage/exchangeSettings";
import { useCallback } from "react";
import styles from "./ChooseButtons.module.scss";

interface Props {
  changingProperty: "sending" | "getting";
  currencyType: "bank" | "crypto";
}

export const ChooseButtons = ({ changingProperty, currencyType }: Props) => {
  const setFromType = useExchangeSettings((state) => state.setFromType);

  const setNewCurrencyType = useCallback((currencyType: "bank" | "crypto") => {
    const secondType = currencyType === "bank" ? "crypto" : "bank";
    if (changingProperty === "sending") {
      setFromType(currencyType);
    } else if (changingProperty === "getting") {
      setFromType(secondType);
    }
  }, []);

  const isCrypto = currencyType === "crypto";
  const bankClassName = clsx(
    styles.chooseCurrencyBank,
    { [styles.active]: !isCrypto },
    []
  );
  const cryptoClassName = clsx(
    styles.chooseCurrencyCrypto,
    { [styles.active]: isCrypto },
    []
  );
  return (
    <>
      <div className={styles.chooseCurrency}>
        <button
          className={bankClassName}
          disabled={!isCrypto}
          onClick={() => setNewCurrencyType("bank")}
        >
          Валюта
        </button>
        <button
          disabled={isCrypto}
          className={cryptoClassName}
          onClick={() => setNewCurrencyType("crypto")}
        >
          Криптовалюта
        </button>
      </div>
    </>
  );
};

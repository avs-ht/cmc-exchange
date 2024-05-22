import clsx from "$/shared/helpers/clsx";
import { useExchangeSettings } from "$/shared/storage/exchangeSettings";
import { useCallback } from "react";
import styles from "./ChooseButtons.module.scss";
import useCurrencyStore from "$/shared/storage/currency";

interface Props {
  changingProperty: "sending" | "getting";
  currencyType: "bank" | "crypto";
}

export const ChooseButtons = ({ changingProperty, currencyType }: Props) => {
  const setFromType = useExchangeSettings((state) => state.setFromType);
  const setToType = useExchangeSettings((state) => state.setToType);
  const setFromCurrency = useCurrencyStore((state) => state.setBankCurrency);
  const setToCurrency = useCurrencyStore((state) => state.setCryptoCurrency);

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

  const setCurrency = useCallback((currency: "bank" | "crypto") => {
    if (changingProperty === "sending") {
      setFromType(currency);
      setFromCurrency("");
    } else {
      setToType(currency);
      setToCurrency("");
    }
  }, []);

  return (
    <>
      <div className={styles.chooseCurrency}>
        <button
          className={bankClassName}
          disabled={!isCrypto}
          onClick={() => {
            setCurrency("bank");
          }}
        >
          Валюта
        </button>
        <button
          disabled={isCrypto}
          className={cryptoClassName}
          onClick={() => {
            setCurrency("crypto");
          }}
        >
          Криптовалюта
        </button>
      </div>
    </>
  );
};

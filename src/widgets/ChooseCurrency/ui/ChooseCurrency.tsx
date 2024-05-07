import clsx from "$/shared/helpers/clsx";
import { useExchangeSettings } from "$/shared/storage/exchangeSettings";
import { TitledBlock } from "$/shared/ui/global/TitledBlock";
import styles from "./ChooseCurrency.module.scss";
import { CurrencyColumnList } from "./CurrencyColumnList/CurrencyColumnList";
import { CurrencyRowList } from "./CurrencyRowList/CurrencyRowList";

interface Props {
  title: string;
  currencyType: "bank" | "crypto";
  changingProperty: "getting" | "sending";
}
export const ChooseCurrency = ({
  title,
  currencyType,
  changingProperty,
}: Props) => {
  const setFromType = useExchangeSettings((state) => state.setFromType);
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

  const setNewCurrencyType = (currencyType: "bank" | "crypto") => {
    const secondType = currencyType === "bank" ? "crypto" : "bank";
    if (changingProperty === "sending") {
      setFromType(currencyType);
    } else if (changingProperty === "getting") {
      setFromType(secondType);
    }
  };
  return (
    <TitledBlock title={title}>
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
      <CurrencyRowList property={currencyType} />
      <CurrencyColumnList property={currencyType} />
    </TitledBlock>
  );
};

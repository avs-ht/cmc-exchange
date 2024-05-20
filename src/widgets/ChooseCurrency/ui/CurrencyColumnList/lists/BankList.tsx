import { useQuery } from "@tanstack/react-query";

import styles from "../CurrencyColumnList.module.scss";

import CurrencyItem from "$/entities/CurrencyItem";
import { currencyAPI } from "$/shared/api/currency";
import clsx from "$/shared/helpers/clsx";
import useCurrencyStore from "$/shared/storage/currency";
import LoadingScreen from "$/shared/ui/global/LoadingScreen";
import ScrollableList from "$/shared/ui/other/ScrollList";
import { SettingsProps } from "../../ChooseCurrency";
import { useEffect } from "react";

export const BankList = ({
  changingProperty,
}: Omit<SettingsProps, "currencyType">) => {
  const { data: fromMethods, isLoading: isFromLoading } = useQuery({
    queryKey: ["fromValues"],
    queryFn: currencyAPI.getFromValues,
    select: (data) => data.data.methods,
  });
  const {
    data: toMethods,
    isLoading: isToLoading,
    refetch,
  } = useQuery({
    queryKey: ["toValues"],
    queryFn: currencyAPI.getToValues,
    select: (data) => data.data.methods,
  });

  useEffect(() => {
    refetch();
  }, [changingProperty]);

  const bankCurrencyType = useCurrencyStore((state) => state.bankCurrencyType);
  const bankCurrency = useCurrencyStore((state) => state.bankCurrency);
  const setBankCurrency = useCurrencyStore((state) => state.setBankCurrency);

  const currency =
    changingProperty === "sending" ? fromMethods?.fiat : toMethods?.fiat;
  const isLoading =
    changingProperty === "sending" ? isFromLoading : isToLoading;

  const banks =
    bankCurrencyType === "all"
      ? currency?.map((bank) => bank.payment_methods).flat()
      : currency?.find((bank) => bank.id === bankCurrencyType)?.payment_methods;

  return (
    <ScrollableList>
      {isLoading ? (
        <LoadingScreen inContainer>Грузим банки</LoadingScreen>
      ) : (
        <div className={styles.list}>
          {banks?.map((bank) => {
            const className = clsx(
              styles.listItem,
              { [styles.active]: `${bankCurrency}` === `${bank.id}` },
              []
            );
            return (
              <div key={bank.id} className={className}>
                <CurrencyItem name={bank.name} image={bank.logo} />
                <button
                  className={styles.itemButton}
                  onClick={() => setBankCurrency(String(bank.id))}
                ></button>
              </div>
            );
          })}
        </div>
      )}
    </ScrollableList>
  );
};

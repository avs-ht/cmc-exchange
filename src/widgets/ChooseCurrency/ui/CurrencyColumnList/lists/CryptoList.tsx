import { useQuery } from "@tanstack/react-query";

import styles from "../CurrencyColumnList.module.scss";

import CurrencyItem from "$/entities/CurrencyItem";
import { currencyAPI } from "$/shared/api/currency";
import clsx from "$/shared/helpers/clsx";
import useCurrencyStore from "$/shared/storage/currency";
import LoadingScreen from "$/shared/ui/global/LoadingScreen";
import ScrollableList from "$/shared/ui/other/ScrollList";
import { useWidgetEnv } from "$/pages/Root/model/widgetEnv";
import { useEffect } from "react";

export const CryptoList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["crypto"],
    queryFn: currencyAPI.getCryptoTokens,
    select: (data) => data.data.methods,
  });
  const { token } = useWidgetEnv((state) => state.widgetEnv);
  const cryptoCurrency = useCurrencyStore((state) => state.cryptoCurrency);
  const setCryptoCurrency = useCurrencyStore(
    (state) => state.setCryptoCurrency
  );
  useEffect(() => {
    if (!token) return;
    setCryptoCurrency(token);
  }, [token]);

  return (
    <ScrollableList>
      {isLoading ? (
        <LoadingScreen inContainer>Грузим криптовалюты</LoadingScreen>
      ) : (
        <div className={styles.list}>
          {data?.map((token) => {
            const className = clsx(
              styles.listItem,
              { [styles.active]: `${cryptoCurrency}` === `${token.id}` },
              []
            );
            return (
              <div key={token.id} className={className}>
                <button
                  className={styles.itemButton}
                  onClick={() => setCryptoCurrency(String(token.id))}
                ></button>
                <CurrencyItem name={token.name} image={token.logo} />
              </div>
            );
          })}
        </div>
      )}
    </ScrollableList>
  );
};

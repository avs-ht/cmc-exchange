import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

import { validateCurrencyInput } from "../lib/validation";

import { currencyAPI } from "$/shared/api/currency";
import useCurrencyStore from "$/shared/storage/currency";
import usePlaceOrder from "$/shared/storage/placeOrder";
import Input from "$/shared/ui/kit/Input";
import { ErrorModal } from "$/shared/ui/modals/ErrorModal";
import styles from "./ChangeInputs.module.scss";
import arrows from "./images/arrows.jpg";
import { useExchangeSettings } from "$/shared/storage/exchangeSettings";

const DELAY = 1000;
export const ChangeInputs = () => {
  const bankCurrency = useCurrencyStore((state) => state.bankCurrency);
  const bankCurrencyType = useCurrencyStore((state) => state.bankCurrencyType);

  const fromSettingCurrency = useExchangeSettings((state) => state.fromType);
  const cryptoCurrency = useCurrencyStore((state) => state.cryptoCurrency);

  const chain = usePlaceOrder((state) => state.chain);
  const setAmount = usePlaceOrder((state) => state.setAmount);
  const setBestP2P = usePlaceOrder((state) => state.setBestP2P);
  const setBestP2PPrice = usePlaceOrder((state) => state.setBestP2PPrice);

  const lastFirstInputAmount = useRef("");
  const lastSecondInputAmount = useRef("");

  const timeout = useRef<NodeJS.Timeout>();

  const [firstInputChanging, setFirstInputChanging] = useState(false);
  const [secondInputChanging, setSecondInputChanging] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [firstInputAmount, setFirstInputAmount] = useState<string>("");
  const [secondInputAmount, setSecondInputAmount] = useState<string>("");
  const [price, setPriceField] = useState<string>("");
  const [profit, setProfit] = useState(0);
  const [errorCode, setErrorCode] = useState(-1);

  const cryptoData = useQuery({
    queryKey: ["crypto"],
    queryFn: currencyAPI.getCryptoTokens,
    select: (data) => data.data.methods,
  });
  const banksData = useQuery({
    queryKey: ["banks"],
    queryFn: currencyAPI.getBanks,
    select: (data) => data.data.methods,
  });

  const priceProps = {
    chain,
    payment_method: bankCurrency,
    token: cryptoCurrency,
  };

  const {
    refetch: tokenRefetch,
    data: tokenData,
    error: tokenError,
  } = useQuery({
    queryKey: [],
    queryFn: () => {
      return currencyAPI.getPrice({
        anchor: "token",
        quantity: +(fromSettingCurrency === "crypto"
          ? firstInputAmount
          : secondInputAmount),
        ...priceProps,
      });
    },
    enabled: false,
  });

  const {
    refetch: bankRefetch,
    data: bankData,
    error: bankError,
  } = useQuery({
    queryKey: [],
    queryFn: () =>
      currencyAPI.getPrice({
        anchor: "currency",
        amount: +(fromSettingCurrency === "bank"
          ? firstInputAmount
          : secondInputAmount),
        ...priceProps,
      }),
    enabled: false,
  });

  useEffect(() => {
    if (firstInputAmount !== "" && secondInputAmount !== "" && cryptoCurrency) {
      if (fromSettingCurrency === "bank") {
        setFirstInputChanging(true);
      } else {
        setSecondInputChanging(true);
      }
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        tokenRefetch();
      }, DELAY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankCurrency]);
  useEffect(() => {
    if (firstInputAmount !== "" && secondInputAmount !== "" && bankCurrency) {
      if (fromSettingCurrency === "crypto") {
        setFirstInputChanging(true);
      } else {
        setSecondInputChanging(true);
      }
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        bankRefetch();
      }, DELAY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoCurrency]);

  useEffect(() => {
    if (fromSettingCurrency === "bank") {
      setSecondInputAmount(`${tokenData?.data.quantity || ""}`);
      lastSecondInputAmount.current = `${bankData?.data.quantity || ""}`;
    } else {
      setFirstInputAmount(`${tokenData?.data.quantity || ""}`);
      lastFirstInputAmount.current = `${bankData?.data.quantity || ""}`;
    }

    setPriceField(`${tokenData?.data.price || ""}`);
    setProfit(tokenData?.data.better_amount || 0);
    setBestP2P(tokenData?.data.best_p2p || "");
    setBestP2PPrice(bankData?.data.best_p2p_price || 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData?.data]);

  useEffect(() => {
    console.log(bankData);
    if (fromSettingCurrency === "bank") {
      {
        setFirstInputAmount(`${bankData?.data.amount || ""}`);
        lastFirstInputAmount.current = `${bankData?.data.amount || ""}`;
      }
    } else {
      setSecondInputAmount(`${bankData?.data.amount || ""}`);
      lastSecondInputAmount.current = `${bankData?.data.amount || ""}`;
    }
    setPriceField(`${bankData?.data.price || ""}`);
    setProfit(bankData?.data.better_amount || 0);
    setBestP2P(bankData?.data.best_p2p || "");
    setBestP2PPrice(bankData?.data.best_p2p_price || 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankData?.data]);

  useEffect(() => {
    setAmount(+firstInputAmount);
    setFirstInputChanging(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstInputAmount]);
  useEffect(() => {
    setSecondInputChanging(false);
  }, [secondInputAmount]);

  const resetData = (errorCode: number | undefined) => {
    if (errorCode === 2 || errorCode === 3) {
      setErrorCode(errorCode);
      setShowErrorModal(true);
    }

    setBestP2P("");
    setFirstInputAmount("");
    setSecondInputAmount("");
    lastFirstInputAmount.current = "";
    lastSecondInputAmount.current = "";
    setPriceField("");
    setProfit(0);
    setFirstInputChanging(false);
    setSecondInputChanging(false);
  };
  useEffect(() => {
    const errorCode =
      (bankError as AxiosError<{ code: number }>)?.response?.data.code ||
      (tokenError as AxiosError<{ code: number }>)?.response?.data.code;

    // 2 - can't price
    // 3 - zero input
    if (errorCode === 2) resetData(2);

    if (errorCode === 3) resetData(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankError, tokenError]);

  useEffect(() => {
    const temp = lastFirstInputAmount.current;
    lastFirstInputAmount.current = lastSecondInputAmount.current;
    lastSecondInputAmount.current = temp;

    setSecondInputAmount(lastSecondInputAmount.current);
    setFirstInputAmount(lastFirstInputAmount.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromSettingCurrency]);

  const token = cryptoData.data?.find((token) => token.id == cryptoCurrency);
  const bank = banksData.data
    ?.find((currency) => {
      return currency.id === bankCurrencyType || bankCurrencyType === "all";
    })
    ?.payment_methods.find((bank) => `${bank.id}` === bankCurrency);

  const isInputDisabled = !token || !bank || !chain;
  const currency = bankCurrencyType === "all" ? "RUB" : bankCurrencyType;
  const isUpdateButtonVisible =
    !isInputDisabled && firstInputAmount && !secondInputChanging;
  const isValueChanging = firstInputChanging || secondInputChanging;
  const isExchangeRateVisible = token?.name && price && currency;
  const isBestRateVisible = currency && profit;

  return (
    <>
      {showErrorModal && (
        <ErrorModal
          text={
            errorCode === 3
              ? "Ошибка получения цены. Попробуйте другую цену или другой способ пополнения"
              : ""
          }
          closeFunction={() => {
            setErrorCode(-1);
            setShowErrorModal(false);
          }}
          useMyFunction
        />
      )}
      <div className={styles.changeInputs}>
        <Input
          disabled={isInputDisabled || firstInputChanging}
          value={firstInputChanging ? "Рассчитываем..." : firstInputAmount}
          disabledStyle={true}
          label="Отдаете"
          onChange={(e) => {
            const formattedValue = validateCurrencyInput(e.target.value);
            if (!formattedValue) return;

            setSecondInputChanging(true);
            setFirstInputAmount(formattedValue);

            if (timeout.current) clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
              if (`${+formattedValue}` === lastFirstInputAmount.current) {
                setSecondInputChanging(false);
                return;
              }

              if (fromSettingCurrency === "crypto") {
                tokenRefetch();
              } else {
                bankRefetch();
              }

              if ([2, 3].includes(errorCode)) {
                setErrorCode(-1);
                setSecondInputAmount(`${bankData?.data.quantity || ""}`);
              }
            }, DELAY);
          }}
          iconUrl={
            fromSettingCurrency === "bank" ? bank?.logo : token?.logo || ""
          }
          iconAlt={bank?.bank_name || ""}
        />
        <Input
          value={secondInputChanging ? "Рассчитываем..." : secondInputAmount}
          disabled={isInputDisabled || secondInputChanging}
          disabledStyle={true}
          label="Получаете"
          onChange={(e) => {
            const formattedValue = validateCurrencyInput(e.target.value);
            if (!formattedValue) return;

            setSecondInputAmount(formattedValue);
            setFirstInputChanging(true);

            if (timeout.current) clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
              if (`${+formattedValue}` === lastSecondInputAmount.current) {
                setFirstInputChanging(false);
                return;
              }

              if (fromSettingCurrency === "bank") {
                tokenRefetch();
              } else {
                bankRefetch();
              }

              if ([2, 3].includes(errorCode)) {
                setErrorCode(-1);
                setFirstInputAmount(`${tokenData?.data.amount || ""}`);
              }
            }, DELAY);
          }}
          iconUrl={
            fromSettingCurrency === "crypto" ? bank?.logo : token?.logo || ""
          }
          iconAlt={token?.name || ""}
        />

        <div className={styles.exchangeRate}>
          <h3 className={styles.exchangeRateTitle}>
            <span className={styles.exchangeRateText}>Курс обмена</span>
            <span className={styles.exchangeRateValue}>
              {isExchangeRateVisible ? (
                <>
                  {isValueChanging ? "..." : price} {currency} = 1 {token?.name}
                </>
              ) : (
                "---"
              )}
            </span>
          </h3>
          <h3 className={styles.exchangeRateTitle}>
            <span className={styles.exchangeRateText}>Курс выгоднее с</span>
            <span className={styles.exchangeRateValue}>
              {isBestRateVisible ? (
                <>
                  {isValueChanging ? "..." : profit} {currency}
                </>
              ) : (
                "---"
              )}
            </span>
          </h3>
        </div>

        {isUpdateButtonVisible && (
          <button
            className={styles.refetchButton}
            onClick={() => {
              setSecondInputChanging(true);
              if (timeout.current) clearTimeout(timeout.current);
              timeout.current = setTimeout(() => {
                if (fromSettingCurrency === "bank") {
                  bankRefetch();
                  setSecondInputAmount(`${bankData?.data.quantity || ""}`);
                  setSecondInputChanging(false);
                } else {
                  tokenRefetch();
                  setSecondInputAmount(`${tokenData?.data.amount || ""}`);
                  setSecondInputChanging(false);
                }
              }, DELAY);
            }}
          >
            <img src={arrows} alt="запрос курса" />
          </button>
        )}
      </div>
    </>
  );
};

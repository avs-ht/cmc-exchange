import { SettingsProps } from "../ChooseCurrency";
import { BankList } from "./lists/BankList";
import { CryptoList } from "./lists/CryptoList";

export const CurrencyColumnList = ({ currencyType }: SettingsProps) =>
  currencyType === "crypto" ? <CryptoList /> : <BankList />;

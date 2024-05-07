import { BankList } from "./lists/BankList";
import { CryptoList } from "./lists/CryptoList";

interface Props {
  property: "bank" | "crypto";
}
export const CurrencyColumnList = ({ property }: Props) =>
  property === "crypto" ? <CryptoList /> : <BankList />;

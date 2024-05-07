import { BankList } from "./lists/BankList";

interface Props {
  property: "crypto" | "bank";
}

export const CurrencyRowList = ({ property }: Props) =>
  property === "crypto" ? <></> : <BankList />;

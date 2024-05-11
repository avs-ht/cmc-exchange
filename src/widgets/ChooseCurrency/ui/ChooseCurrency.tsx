import { TitledBlock } from "$/shared/ui/global/TitledBlock";
import { ChooseButtons } from "./ChooseButtons/ChooseButtons";

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
  return (
    <TitledBlock title={title}>
      <ChooseButtons
        changingProperty={changingProperty}
        currencyType={currencyType}
      />
      <CurrencyRowList property={currencyType} />
      <CurrencyColumnList property={currencyType} />
    </TitledBlock>
  );
};

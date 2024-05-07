import { create } from "zustand";

interface CurrencyState {
  bankCurrencyType: string;
  bankCurrency: string;
  cryptoCurrency: string;

  setBankCurrency: (currency: string) => void;
  setBankCurrencyType: (type: string) => void;

  setCryptoCurrency: (currency: string) => void;
}
const useCurrencyStore = create<CurrencyState>((set) => ({
  bankCurrencyType: "all",
  bankCurrency: "",
  cryptoCurrency: "",
  setBankCurrency: (currency: string) => set({ bankCurrency: currency }),
  setCryptoCurrency: (currency: string) => set({ cryptoCurrency: currency }),
  setBankCurrencyType: (type: string) => set({ bankCurrencyType: type }),
}));

export default useCurrencyStore;

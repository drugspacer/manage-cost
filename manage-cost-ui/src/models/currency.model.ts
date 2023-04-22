import currency from "../constants/currency";

type CurrencyRs<T extends keyof typeof currency> = {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: keyof typeof currency;
  rates: Record<T, number>;
};

export default CurrencyRs;

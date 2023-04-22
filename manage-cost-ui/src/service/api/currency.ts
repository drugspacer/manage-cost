import ApiService from "../api.service";
import currency from "../../constants/currency";
import { OPENEXCHANGE_TOKEN } from "../../constants/token";
import CurrencyRs from "../../models/currency.model";

class CurrencyApi {
  static exchangeRate<T extends keyof typeof currency>(
    fromCurrency: keyof typeof currency,
    toCurrency: T
  ) {
    const url = new URL("https://openexchangerates.org/api/latest.json");
    url.search = new URLSearchParams({
      app_id: OPENEXCHANGE_TOKEN,
      symbols: `${fromCurrency},${toCurrency}`,
      prettyprint: "0",
    }).toString();
    return ApiService.request<CurrencyRs<T>, undefined, true>({
      url: url.toString(),
      jwtAuth: false,
      withCredentials: false,
    });
  }
}

export default CurrencyApi;

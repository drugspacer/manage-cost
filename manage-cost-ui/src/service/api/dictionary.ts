import ApiService from "../api.service";
import Dictionary from "../../models/dictionary.model";

class DictionaryApi {
  static tags() {
    return ApiService.request<Dictionary[]>({ url: "/tags" });
  }
}

export default DictionaryApi;

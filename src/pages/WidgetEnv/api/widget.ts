import axios from "axios";
import { WidgetEnv } from "../../../shared/types/api/enitites";
import getCookieValue from "$/shared/helpers/getCookie";

class WidgetAPI {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getWidgetEnv(widgetId: string) {
    const body = new FormData();
    body.append("widget_hash", widgetId);
    body.append("order_hash", getCookieValue("order_hash") || "");
    return await axios.get<WidgetEnv>(`${this.apiUrl}/widget_settings`);
  }
}

export const widgetAPI = new WidgetAPI("https://api.fleshlight.fun/api");

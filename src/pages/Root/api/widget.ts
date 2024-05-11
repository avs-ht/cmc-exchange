import axios from "axios";
import { WidgetEnv } from "../../../shared/types/api/enitites";

class WidgetAPI {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async getWidgetEnv() {
    return await axios.get<WidgetEnv>(`${this.apiUrl}/widget_settings`);
  }
}

export const widgetAPI = new WidgetAPI("https://api.fleshlight.fun/api");

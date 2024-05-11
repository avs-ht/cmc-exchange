import { widgetAPI } from "$/pages/Root/api/widget";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWidgetEnv } from "../../model/widgetEnv";

export const WidgetEnv = ({ children }: { children: React.ReactNode }) => {
  const setWidgetEnv = useWidgetEnv((state) => state.setWidgetEnv);
  const { data } = useQuery({
    queryKey: ["widgetEnv"],
    queryFn: widgetAPI.getWidgetEnv,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (!data) return;
    const { color_palette: colorScheme, ...widgetEnvWithoutColors } = data;
    setWidgetEnv(widgetEnvWithoutColors);
  }, [data]);
  return <>{children}</>;
};

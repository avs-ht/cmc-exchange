import { widgetAPI } from "$/pages/Root/api/widget";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWidgetEnv } from "../../model/widgetEnv";

export const WidgetEnv = ({ children }: { children: React.ReactNode }) => {
  const setWidgetEnv = useWidgetEnv((state) => state.setWidgetEnv);
  const { data, isSuccess } = useQuery({
    queryKey: ["widgetEnv"],
    queryFn: widgetAPI.getWidgetEnv,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (!isSuccess) return;

    const { color_palette: colorScheme, ...widgetEnvWithoutColors } = data;

    setWidgetEnv(widgetEnvWithoutColors);

    if (!colorScheme) return;

    const bodyCSS = getComputedStyle(document.body);
    for (const [colorName, color] of Object.entries(colorScheme)) {
      const currValue = bodyCSS.getPropertyValue(`--${colorName}`);

      if (!currValue || !color) return;

      document.body.style.setProperty(`--${colorName}`, `${color}`);
    }
  }, [isSuccess]);
  return <>{children}</>;
};

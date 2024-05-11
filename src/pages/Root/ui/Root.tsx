import { Outlet } from "@tanstack/react-router";
import Wrapper from "./Wrapper";
export { useWidgetEnv } from "../model/widgetEnv";

export const Root = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
};

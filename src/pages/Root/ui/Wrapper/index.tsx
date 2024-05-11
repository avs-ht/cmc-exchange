import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import styles from "./index.module.scss";
import { WidgetEnv } from "../WidgetEnv/WidgetEnv";

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetEnv>
        <div className={styles.wrapper}>{children}</div>
      </WidgetEnv>
    </QueryClientProvider>
  );
};

export default Wrapper;

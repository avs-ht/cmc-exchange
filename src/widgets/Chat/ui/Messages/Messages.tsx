import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getDateFromMessage } from "../../lib/message";

import { Message } from "$/entities/Message/ui/Message";
import { orderAPI } from "$/shared/api/order";
import LoadingScreen from "$/shared/ui/global/LoadingScreen";
import ScrollableList from "$/shared/ui/other/ScrollList";
import { useStagesStore } from "$/widgets/Stages";
import styles from "./Messages.module.scss";

const UPDATE_INTERVAL = 10000;
export const Messages = () => {
  const stage = useStagesStore((state) => state.stage);
  const {
    data,
    refetch: updateMessages,
    isLoading,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: () => {
      return orderAPI.getOrderMessages();
    },
    select: (data) => data.data,
  });

  useEffect(() => {
    const updateInterval = setInterval(() => {
      updateMessages();
    }, UPDATE_INTERVAL);

    return clearInterval(updateInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messages = data?.messages.sort(
    (m1, m2) => getDateFromMessage(m1) - getDateFromMessage(m2)
  );

	messages?.push({
		uuid: '1',
		text: '',
		dt: '23232 232:32',
		nick_name: 'TEST',
		image: '',
		side: "USER"		
	})

  return (
    <ScrollableList listClassName={styles.messages}>
      {stage !== "ERROR" && (
        <>
          {isLoading ? (
            <LoadingScreen>Грузим сообщения...</LoadingScreen>
          ) : (
            <>
              {messages?.map((message, index) => (
                <Message key={index} message={message} />
              ))}
            </>
          )}
        </>
      )}
    </ScrollableList>
  );
};

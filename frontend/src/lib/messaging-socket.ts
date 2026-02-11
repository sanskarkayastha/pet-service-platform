import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { API_BASE_URL } from "@/lib/api-fetch";

export type MessagingSubscription = StompSubscription;

const WS_ENDPOINT = (() => {
  if (API_BASE_URL.startsWith("https")) {
    return API_BASE_URL.replace("https", "wss");
  }
  return API_BASE_URL.replace("http", "ws");
})();

export function createMessagingClient(token: string): Client {
  const client = new Client({
    brokerURL: `${WS_ENDPOINT}/ws?token=${encodeURIComponent(token)}`,
    reconnectDelay: 5000,
    heartbeatIncoming: 12000,
    heartbeatOutgoing: 12000,
    debug: process.env.NODE_ENV === "development" ? console.debug : () => {},
  });

  client.onStompError = (frame: IMessage) => {
    console.error("Broker reported error:", frame.body);
  };

  client.onWebSocketError = (event) => {
    console.error("WebSocket error", event);
  };

  return client;
}

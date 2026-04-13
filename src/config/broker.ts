import { ServiceBroker } from "moleculer";

export const broker = new ServiceBroker({
  nodeID: "b89-node",
  logger: {
    type: "Console",
    options: {
      level: "info",
      colors: true,
    },
  },
});
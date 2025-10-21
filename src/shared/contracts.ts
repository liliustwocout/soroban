import * as Election from "election";
import { SorobanRpc } from "stellar-sdk";
import config from "./config.json";
const { network, rpcUrl } = config;
export const election = new Election.Contract({
  rpcUrl,
  ...Election.networks[network as keyof typeof Election.networks],
});
export const server = new SorobanRpc.Server(rpcUrl, {
  allowHttp: rpcUrl.startsWith("Http:"),
});
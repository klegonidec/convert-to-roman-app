import http from "http";
export type HttpHandler = (request: http.IncomingMessage, response : http.ServerResponse) => Promise<boolean>;
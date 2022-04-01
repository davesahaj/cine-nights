import { baseURL } from "./api";
import { io } from "socket.io-client";

export const socket = io.connect(baseURL);

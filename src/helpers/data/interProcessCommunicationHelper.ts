import net from "net";
import { terminalUtils } from "../../utils/index.js";
import { env } from "process";

const PIPE_PATH =
  process.platform === "win32"
    ? "\\\\.\\pipe\\PlaywrightDemo_TS\\reporter\\validations"
    : "/tmp/PlaywrightDemo_TS/reporter/validations";

let server: net.Server;
let socket: net.Socket;

export const interProcessCommunicationHelper = {
  setupServer() {
    server = net.createServer((socket) => {
      socket.on("data", (data) => {
        const messages = data.toString().slice(0, -1);
        const uniqueMessages = Array.from(new Set(messages.split(",")));
        const reponse = uniqueMessages
          .map((uniqueMessage) => {
            if (
              uniqueMessage === "azure" &&
              (!env.AZURE_VALIDATION || env.AZURE_VALIDATION === "ok")
            ) {
              return "azureValidationFinished";
            } else if (
              uniqueMessage === "excel" &&
              (!env.EXCEL_VALIDATION || env.EXCEL_VALIDATION === "ok")
            ) {
              return "excelValidationFinished";
            } else {
              terminalUtils.printColoredText(
                `Unexpected request from client: ${uniqueMessage}`,
                "red",
              );
            }
          })
          .join(",");
        socket.write(reponse);
      });
    });
    server.on("error", (err) => {
      throw err;
    });
    server.listen(PIPE_PATH);
  },
  setupClient() {
    socket = net.createConnection({ path: PIPE_PATH });
    socket.on("data", (data) => {
      const messages = data.toString();
      messages.split(",").forEach((message) => {
        if (message === "azureValidationFinished") {
          env.AZURE_VALIDATION = "ok";
        } else if (message === "excelValidationFinished") {
          env.EXCEL_VALIDATION = "ok";
        } else
          terminalUtils.printColoredText(
            `Unexpected response from server: ${message}`,
            "red",
          );
      });
    });
    socket.on("error", (err) => {
      terminalUtils.printColoredText(`Client error: ${err.message}`, "red");
      if (err.message.includes("ENOENT")) {
        env.AZURE_VALIDATION = "ok";
        env.EXCEL_VALIDATION = "ok";
      }
    });
  },
  writeToServer(message: "azure" | "excel") {
    socket.write(`${message},`);
  },
  closeConnection() {
    socket.end();
  },
};

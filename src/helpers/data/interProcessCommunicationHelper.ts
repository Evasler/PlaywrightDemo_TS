import net from "net";
import { terminalUtils } from "../../utils/index.js";
import { env } from "process";

/**
 * When using PIPE_PATH instead of PORT, "Error: listen EADDRINUSE: address already in use" was thrown on GitHub Actions.
 * Locally, the Server and the Client were exchanging messages without issues.
 * Never understood why.
 * Before the execution step, the following commands were run to generate the necessary directory:
 * mkdir -p /tmp/PlaywrightDemo_TS/reporter/validations
 * chmod 777 /tmp/PlaywrightDemo_TS/reporter/validations
const PIPE_PATH =
  process.platform === "win32"
    ? "\\\\.\\pipe\\PlaywrightDemo_TS\\reporter\\validations"
    : "/tmp/PlaywrightDemo_TS/reporter/validations";
**/

const PORT = 3000;

let server: net.Server;
let socket: net.Socket;

function setupServer() {
  server = net.createServer((socket) => {
    socket.on("data", (data) => {
      const messages = data.toString().slice(0, -1);
      const uniqueMessages = Array.from(new Set(messages.split(",")));
      uniqueMessages.map((uniqueMessage) => {
        if (
          uniqueMessage === "azure" &&
          (!env.AZURE_VALIDATION || env.AZURE_VALIDATION === "ok")
        ) {
          socket.write("azureValidationFinished,");
        } else if (
          uniqueMessage === "excel" &&
          (!env.EXCEL_VALIDATION || env.EXCEL_VALIDATION === "ok")
        ) {
          socket.write("excelValidationFinished,");
        } else {
          terminalUtils.printColoredText(
            `Unexpected request from client: ${uniqueMessage}`,
            "red",
          );
        }
      });
    });
  });
  server.listen(PORT);
}

function setupClient() {
  socket = net.createConnection({ port: PORT });
  socket.on("data", (data) => {
    const messages = data.toString().slice(0, -1);
    messages.split(",").forEach((message) => {
      if (message === "azureValidationFinished") {
        terminalUtils.printColoredText(`AZURE_VALIDATION: ${env.AZURE_VALIDATION}`, "red");
        env.AZURE_VALIDATION = "ok";
      } else if (message === "excelValidationFinished") {
        terminalUtils.printColoredText(`EXCEL_VALIDATION: ${env.EXCEL_VALIDATION}`, "red");
        env.EXCEL_VALIDATION = "ok";
      } else
        terminalUtils.printColoredText(
          `Unexpected response from server: ${message}`,
          "red",
        );
    });
  });
}

export const interProcessCommunicationHelper = {
  setup() {
    if (!process.env.SERVER_STARTED_ON_MAIN_PROCESS) {
      process.env.SERVER_STARTED_ON_MAIN_PROCESS = "true";
      setupServer();
    } else setupClient();
  },
  writeToServer(message: "azure" | "excel") {
    socket.write(`${message},`);
  },
  closeConnection() {
    socket.end();
  },
};

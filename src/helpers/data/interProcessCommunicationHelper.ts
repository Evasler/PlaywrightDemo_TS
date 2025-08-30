import net from "net";
import { terminalUtils } from "../../utils/index.js";
import { env } from "process";

const PIPE_PATH =
  process.platform === "win32"
    ? "\\\\.\\pipe\\PlaywrightDemo_TS\\ReporterStatuses"
    : "/tmp/PlaywrightDemo_TS/ReporterStatuses";

let server: net.Server;
let socket: net.Socket;

export const interProcessCommunicationHelper = {
  setupServer() {
    server = net.createServer((socket) => {
      socket.on("data", (data) => {
        const dataString = data.toString();
        if (dataString === "azure") {
          if (env.AZURE_REPORTER_STATUS === "ready")
            socket.write("azureReporterIsReady");
        } else if (dataString === "excel") {
          if (env.EXCEL_REPORTER_STATUS === "ready")
            socket.write("excelReporterIsReady");
        } else {
          terminalUtils.printColoredText(
            `Unexpected request from client: ${dataString}`,
            "red",
          );
        }
      });
    });
    server.listen(PIPE_PATH);
  },
  setupClient() {
    socket = net.createConnection({ path: PIPE_PATH });
    socket.on("data", (data) => {
      const dataString = data.toString();
      if (dataString === "azureReporterIsReady") {
        env.AZURE_REPORTER_STATUS = "ready";
      } else if (dataString === "excelReporterIsReady") {
        env.EXCEL_REPORTER_STATUS = "ready";
      } else
        terminalUtils.printColoredText(
          `Unexpected response from server: ${dataString}`,
          "red",
        );
      socket.end();
    });
  },
  writeToServer(message: "azure" | "excel") {
    socket.write(message);
  },
};

/**
 * @description This module provides an inter-process communication mechanism for
 * exchanging messages between different processes. It handles data updates
 * between the server and client processes.
 */

import net from "net";
import { terminalUtils } from "../../utils/index.js";
import { env } from "process";
import { expect } from "@playwright/test";
import zodHelper from "./zodHelper.js";
import z from "zod";

/**
 * When using PIPE_PATH instead of PORT, "Error: listen EADDRINUSE: address already in use" was thrown on GitHub Actions.
 * Locally, the Server and the Client were exchanging messages without issues.
 * Never understood why.
 * Before the execution step, the following commands were run to generate the necessary directory:
 *   mkdir -p /tmp/PlaywrightDemo_TS/reporter/validations
 *   chmod 777 /tmp/PlaywrightDemo_TS/reporter/validations
 * Tried without the directory creation commands, as well.
 * Also, tried with and without "options: --user root" for the container.
const PIPE_PATH =
  process.platform === "win32"
    ? "\\\\.\\pipe\\PlaywrightDemo_TS\\reporter\\validations"
    : "/tmp/PlaywrightDemo_TS/reporter/validations";
**/

/**
 * The server instance for handling client connections.
 */
let server: net.Server;

/**
 * The socket connection used by the client to communicate with the server.
 */
let socket: net.Socket;

/**
 * Sets up a server to listen for and respond to client validation requests.
 *
 * The server handles specific validation status requests from clients
 * and responds with appropriate validation finished messages.
 */
async function setupServer() {
  server = net.createServer((socket) => {
    socket.on("data", (data) => {
      const messages = data.toString().slice(0, -1);
      const uniqueMessages = Array.from(new Set(messages.split(",")));
      uniqueMessages.map((uniqueMessage) => {
        if (
          uniqueMessage === "azureValidationStatus" &&
          (!env.AZURE_VALIDATION || env.AZURE_VALIDATION === "ok")
        ) {
          socket.write("azureValidationFinished,");
        } else if (
          uniqueMessage === "excelValidationStatus" &&
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
  server.on("listening", () => {
    const serverAddress = zodHelper.prettyParse(
      z.strictObject({
        port: z.number(),
        family: z.string(),
        address: z.string(),
      }),
      server.address(),
    );
    env.SERVER_PORT = String(serverAddress.port);
  });
  server.listen(0);
  await expect.poll(() => env.SERVER_PORT).toBeDefined();
}

/**
 * Sets up a client connection to the server to send and receive validation messages.
 *
 * The client processes server responses and updates environment variables
 * to reflect the validation status.
 */
function setupClient() {
  const port = Number(zodHelper.prettyParse(z.string(), env.SERVER_PORT));
  socket = net.createConnection({ port: port });
  socket.on("data", (data) => {
    const messages = data.toString().slice(0, -1);
    const uniqueMessages = Array.from(new Set(messages.split(",")));
    uniqueMessages.forEach((message) => {
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
}

/**
 * Helper module for inter-process communication during test execution.
 *
 * This module provides functionality to establish communication between different processes.
 * It determines whether to set up a server or client based on environment variables.
 */
export const interProcessCommunicationHelper = {
  /**
   * Sets up either a server or client connection based on environment variables.
   *
   * If this is the first process to call setup, it will initialize a server.
   * Otherwise, it will initialize a client connection to the existing server.
   */
  async setup() {
    if (!process.env.SERVER_STARTED_ON_MAIN_PROCESS) {
      process.env.SERVER_STARTED_ON_MAIN_PROCESS = "true";
      await setupServer();
    } else setupClient();
  },

  /**
   * Sends a message from the client to the server.
   *
   * @param message - The message to send to the server
   */
  writeToServer(message: "azureValidationStatus" | "excelValidationStatus") {
    socket.write(`${message},`);
  },

  /**
   * Closes the client connection to the server.
   *
   * This method should be called when the client no longer needs
   * to communicate with the server.
   */
  closeConnection() {
    socket.end();
  },
};

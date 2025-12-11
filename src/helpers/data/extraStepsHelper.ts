/**
 * @description This module provides functionality for executing setup and teardown API actions
 * before and after tests, as part of test preparation or cleanup.
 */

import { test } from "@playwright/test";
import type { ExtraStepsArgs } from "../../types/index.js";
import { authSteps, roomSteps } from "../../services/index.js";
import { generalUtils, terminalUtils } from "../../utils/index.js";
import { openNewThrowAwayContext } from "playwrap";

/**
 * Helper module for managing test setup and teardown actions via API.
 *
 * This module is designed to be used in fixtures and facilitates performing
 * preparatory or cleanup actions on the application before or after tests run.
 */
const extraStepsHelper = {
  /**
   * Executes a sequence of API actions based on the provided configuration.
   *
   * This method creates a throwaway API context and performs the specified actions,
   * and wraps them in a Playwright step.
   *
   * @param steps - Type of steps to execute (`setup` or `teardown`)
   * @param extraStepsArgsArray - Array of configuration objects defining which API actions to perform
   * @returns A playwright step that wraps all performed actions
   */
  execute(steps: "setup" | "teardown", extraStepsArgsArray: ExtraStepsArgs[]) {
    return test.step(steps, async () => {
      if (extraStepsArgsArray.length > 0)
        terminalUtils.printColoredText(
          generalUtils.padCenteredString(steps.toUpperCase(), 80),
          "blue",
        );
      for (const extraStepsArgs of extraStepsArgsArray) {
        await openNewThrowAwayContext();
        if (extraStepsArgs.loginArgs)
          await authSteps.login(extraStepsArgs.loginArgs);
        if (extraStepsArgs.createRoomArgsArray)
          for (const createRoomArgs of extraStepsArgs.createRoomArgsArray)
            await roomSteps.createRoom(createRoomArgs);
        if (extraStepsArgs.getRoomIdArgsArray)
          for (const getRoomIdArgs of extraStepsArgs.getRoomIdArgsArray)
            await roomSteps.getRoomId(getRoomIdArgs);
        if (extraStepsArgs.deleteRoomArgsArray)
          for (const deleteRoomArgs of extraStepsArgs.deleteRoomArgsArray)
            await roomSteps.deleteRoom(deleteRoomArgs);
      }
    });
  },
};

export default extraStepsHelper;

import { test } from "@playwright/test";
import type { ExtraStepsArgs } from "../../types/index.js";
import { authSteps, roomSteps } from "../../services/index.js";
import requestHelper from "../channel/requestHelper.js";
import { generalUtils, terminalUtils } from "../../utils/index.js";

/**
 * Better used in a fixture.
 * Facilitates the BeforeTest and AfterTest actions, which should be performed on the application via API.
 */
const extraStepsHelper = {
  /**
   * Executes actions via API, based on the provided ExtraStepsArgs array.
   * @param steps
   * @param extraStepsArgsArray
   * @returns A playwright step, which wraps all performed actions.
   */
  execute(steps: "setup" | "teardown", extraStepsArgsArray: ExtraStepsArgs[]) {
    return test.step(steps, async () => {
      if (extraStepsArgsArray.length > 0)
        terminalUtils.printColoredText(
          generalUtils.padCenteredString(steps.toUpperCase(), 80),
          "blue",
        );
      for (const extraStepsArgs of extraStepsArgsArray) {
        await requestHelper.openNewThrowAwayContext();
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

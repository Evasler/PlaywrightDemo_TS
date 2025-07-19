import { test } from "@playwright/test";
import { requestHelper } from "../index.js";
import type { ExtraStepsArgs } from "../../types/index.js";
import { authSteps, roomSteps } from "../../services/index.js";

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
    execute(steps: "setupSteps" | "teardownSteps", extraStepsArgsArray: ExtraStepsArgs[]) {
        return test.step(steps, async() => {
            for (const stepsArgs of extraStepsArgsArray) {
                await requestHelper.openNewThrowAwayContext();
                if (stepsArgs.loginArgs)
                    await authSteps.login(stepsArgs.loginArgs);
                if (stepsArgs.createRoomArgsArray)
                    for (const createRoomArgs of stepsArgs.createRoomArgsArray)
                        await roomSteps.createRoom(createRoomArgs);
                if (stepsArgs.getRoomIdArgsArray)
                    for (const getRoomIdArgs of stepsArgs.getRoomIdArgsArray)
                        await roomSteps.getRoomId(getRoomIdArgs);
                if (stepsArgs.deleteRoomArgsArray)
                    for (const deleteRoomArgs of stepsArgs.deleteRoomArgsArray)
                        await roomSteps.deleteRoom(deleteRoomArgs);
            }
        });
    }
}

export default extraStepsHelper;
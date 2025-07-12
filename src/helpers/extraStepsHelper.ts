import { ExtraStepsArgs } from "../customTypes/stepArgsTypes";
import authSteps from "../services/auth/authSteps";
import roomSteps from "../services/room/roomSteps";
import stepSequenceHelper from "./chaining/stepSequenceHelper";
import requestHelper from "./channel/requestHelper";
import test from "@playwright/test";

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
                requestHelper.openNewThrowAwayContext();
                if (stepsArgs.loginArgs)
                    authSteps.login(stepsArgs.loginArgs);
                if (stepsArgs.createRoomArgsArray)
                    for (const createRoomArgs of stepsArgs.createRoomArgsArray)
                        roomSteps.createRoom(createRoomArgs);
                if (stepsArgs.getRoomIdArgsArray)
                    for (const getRoomIdArgs of stepsArgs.getRoomIdArgsArray)
                        roomSteps.getRoomId(getRoomIdArgs);
                if (stepsArgs.deleteRoomArgsArray)
                    for (const deleteRoomArgs of stepsArgs.deleteRoomArgsArray)
                        roomSteps.deleteRoom(deleteRoomArgs);
            }
            await stepSequenceHelper.stepSequence;
        });
    }
}

export default extraStepsHelper;
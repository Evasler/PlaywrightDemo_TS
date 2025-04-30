import { ExtraStepsArgs } from "../customTypes/StepArgsTypes";
import RequestHelper from "./channel/RequestHelper";
import ServiceStepsHelper from "./objectInstantiation/ServiceStepsHelper";
import test from "@playwright/test";

/**
 * Better used in a fixture.
 * Facilitates the BeforeTest and AfterTest actions, which should be performed on the application via API.
 */
export default class ExtraStepsHelper {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _serviceStepsHelper: ServiceStepsHelper) { }

    /**
     * Executes actions via API, based on the provided ExtraStepsArgs array.
     * @param steps 
     * @param extraStepsArgsArray 
     * @returns A playwright step, which wraps all performed actions.
     */
    execute(steps: "setupSteps" | "teardownSteps", extraStepsArgsArray: ExtraStepsArgs[]) {
        return test.step(steps, async() => {
            for (const stepsArgs of extraStepsArgsArray) {
                this._requestHelper.openNewThrowAwayContext();
                if (stepsArgs.loginArgs)
                    this._serviceStepsHelper.authSteps.login(stepsArgs.loginArgs);
                if (stepsArgs.createRoomArgsArray)
                    for (const createRoomArgs of stepsArgs.createRoomArgsArray)
                        this._serviceStepsHelper.roomSteps.createRoom(createRoomArgs);
                if (stepsArgs.getRoomIdArgsArray)
                    for (const getRoomIdArgs of stepsArgs.getRoomIdArgsArray)
                        this._serviceStepsHelper.roomSteps.getRoomId(getRoomIdArgs);
                if (stepsArgs.deleteRoomArgsArray)
                    for (const deleteRoomArgs of stepsArgs.deleteRoomArgsArray)
                        this._serviceStepsHelper.roomSteps.deleteRoom(deleteRoomArgs);
            }
            await this._serviceStepsHelper.authSteps._execute();
        });
    }
}
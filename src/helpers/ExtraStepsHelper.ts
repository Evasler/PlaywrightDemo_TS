import { StepsArgsArray } from "../customTypes/StepArgsTypes";
import RequestHelper from "./RequestHelper";
import ServiceHelper from "./ServiceHelper";
import test from "@playwright/test";

export default class ExtraStepsHelper {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _serviceHelper: ServiceHelper) { }

    execute(steps: "setupSteps" | "teardownSteps", stepsArgsArray: StepsArgsArray) {
        return test.step(steps, async() => {
            for (const stepsArgs of stepsArgsArray) {
                this._requestHelper.openNewThrowAwayContext();
                if (stepsArgs.loginArgs)
                    this._serviceHelper.authService.login(stepsArgs.loginArgs);
                if (stepsArgs.createRoomArgsArray)
                    for (const createRoomArgs of stepsArgs.createRoomArgsArray)
                        this._serviceHelper.roomService.createRoom(createRoomArgs);
                if (stepsArgs.getRoomIdArgsArray)
                    for (const getRoomIdArgs of stepsArgs.getRoomIdArgsArray)
                        this._serviceHelper.roomService.getRoomId(getRoomIdArgs);
                if (stepsArgs.deleteRoomArgsArray)
                    for (const deleteRoomArgs of stepsArgs.deleteRoomArgsArray)
                        this._serviceHelper.roomService.deleteRoom(deleteRoomArgs);
            }
            await this._serviceHelper.authService._execute();
        });
    }
}
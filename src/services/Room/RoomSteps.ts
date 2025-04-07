import { expect } from "@playwright/test";
import RequestHelper from "../../helpers/RequestHelper";
import StepSequenceHelper from "../../helpers/StepSequenceHelper";
import BaseServiceSteps from "../Base/BaseServiceSteps";
import RoomRequests from "./RoomRequests";
import TempDataHelper from "../../helpers/TempDataHelper";
import { CreateRoomResponse, GetRoomResponse } from "../../customTypes/ApiResponseTypes";
import { CreateRoomArgs, DeleteRoomArgs, GetRoomIdArgs } from "../../customTypes/StepArgsTypes";

export default class RoomSteps extends BaseServiceSteps {
    
    private readonly _roomRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper, tempDataHelper);
        this._roomRequests = new RoomRequests(requestHelper, baseUrl);
    }
    
    getAllRooms() {
        this.addStep("getAllRooms", async() => {
            console.log("getAllRooms");
            const response = await this._roomRequests.getRoom();
            expect(response.status).toEqual(200);
        });
        return this;
    }
    
    createRoom({ payload }: CreateRoomArgs) {
        this.addStep("createRoom", async() => {
            console.log("createRoom");
            const response = await this._roomRequests.postRoom(payload);
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as CreateRoomResponse;
            expect(responseJson.success).toBeTruthy();
        });
        return this;
    }

    getRoomId({ roomName, tempDataKeyPrefix }: GetRoomIdArgs) {
        this.addStep("getRoomId", async() => {
            console.log("getRoomId");
            const response = await this._roomRequests.getRoom();
            expect(response.status()).toEqual(200);
            const responseJson = await response.json() as GetRoomResponse;
            const room = responseJson.rooms.find(room => room.roomName === roomName);
            expect(room).toBeDefined();
            this.setTempData(`${tempDataKeyPrefix}_roomId`, room!.roomid);
        });
        return this;
    }

    deleteRoom({ tempDataKeyPrefix }: DeleteRoomArgs) {
        this.addStep("deleteRoom", async () => {
            console.log("deleteRoom");
            const response = await this._roomRequests.deleteRoom(this.getTempNumberData(`${tempDataKeyPrefix}_roomId`));
            expect(response.status()).toEqual(200);
        });
        return this;
    }
}
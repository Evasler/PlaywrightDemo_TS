import { expect } from "@playwright/test";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BaseService } from "../Base/BaseService";
import { RoomRequests } from "./RoomRequests";
import { DataHelper } from "../../helpers/DataHelper";
import { CreateRoomResponse } from "../../customTypes/ApiResponseTypes";
import { CreateRoomPayload } from "../../customTypes/ApiPayloadTypes";

export class RoomService extends BaseService {
    
    private readonly _roomRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, dataHelper: DataHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper, dataHelper);
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
    
    createRoom(tempDataUniqueId: string, payload: CreateRoomPayload) {
        this.addStep("createRoom", async() => {
            console.log("createRoom");
            const response = await this._roomRequests.postRoom(payload);
            expect(response.status()).toEqual(201);
            const responseJson = await response.json() as CreateRoomResponse;
            this.setTempData(`${tempDataUniqueId}_roomId`, responseJson.roomid);
        });
        return this;
    }

    deleteRoom(tempDataUniqueId: string) {
        this.addStep("deleteRoom", async () => {
            console.log("deleteRoom");
            const response = await this._roomRequests.deleteRoom(this.getTempNumberData(`${tempDataUniqueId}_roomId`));
            expect(response.status()).toEqual(202);
        });
        return this;
    }
}
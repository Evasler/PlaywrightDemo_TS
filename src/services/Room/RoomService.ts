import { expect } from "@playwright/test";
import { RequestHelper } from "../../helpers/RequestHelper";
import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BaseService } from "../BaseService";
import { RoomRequests } from "./RoomRequests";

export class RoomService extends BaseService {
    
    private readonly roomRequests;

    constructor(requestHelper: RequestHelper, stepSequenceHelper: StepSequenceHelper, baseUrl: string) {
        super(requestHelper, stepSequenceHelper);
        this.roomRequests = new RoomRequests(requestHelper, baseUrl);
    }
    
    getAllRooms() {
        this.addStep("getAllRooms", async() => {
            const response = await this.roomRequests.getRoom();
            expect(response.status).toEqual(200);
        });
        return this;
    }
    
    createRoom(roomName: string, type: string, accessible: "true" | "false", description: string, image: string, roomPrice: string, features: string[]) {
        this.addStep("createRoom", async() => {
            const response = await this.roomRequests.postRoom(roomName, type, accessible, description, image, roomPrice, features);
            expect(response.status()).toEqual(201);
        });
        return this;
    }
}
import { BaseRequests } from "../Base/BaseRequests";
import { RequestHelper } from "../../helpers/RequestHelper";
import { RoomUrls } from "./RoomUrls";

export class RoomRequests extends BaseRequests {

    private readonly _roomUrls;

    constructor(requestHelper: RequestHelper, baseUrl: string) {
        super(requestHelper, baseUrl);
        this._roomUrls = new RoomUrls(baseUrl);
    }

    async getRoom() {
        return this.workingRequest.get(this._roomUrls.serviceBaseUrl);
    }

    async postRoom(roomName: string, type: string, accessible: "true" | "false", description: string, image: string, roomPrice: string, features: string[]) {
        const payload = {
            roomName: roomName,
            type: type,
            accessible: accessible,
            description: description,
            image: image,
            roomPrice: roomPrice,
            features: features
        }
        return this.workingRequest.post(this._roomUrls.serviceBaseUrl, { data: payload });
    }

    async deleteRoom(roomId: number) {
        return this.workingRequest.delete(this._roomUrls.roomUrl(roomId));
    }
}
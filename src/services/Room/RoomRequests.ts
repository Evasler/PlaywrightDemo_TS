import { BaseRequests } from "../Base/BaseRequests";
import { RequestHelper } from "../../helpers/RequestHelper";

export class RoomRequests extends BaseRequests {

    constructor(requestHelper: RequestHelper, baseUrl: string) { super(requestHelper, baseUrl) }

    private readonly _roomBase = "room/";

    private get _roomBaseUrl() { return `${this.baseUrl}${this._roomBase}`}
    private roomUrl(roomId: number) { return `${this._roomBaseUrl}/${roomId}`}

    async getRoom() {
        return this.workingRequest.get(this._roomBaseUrl);
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
        return this.workingRequest.post(this._roomBaseUrl, { data: payload });
    }

    async deleteRoom(roomId: number) {
        return this.workingRequest.delete(this.roomUrl(roomId));
    }
}
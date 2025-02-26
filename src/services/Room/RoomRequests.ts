import { RequestHelper } from "../../helpers/RequestHelper";

export class RoomRequests {

    constructor(private readonly _requestHelper: RequestHelper, private readonly _baseUrl: string) { }

    private get workingRequest() { return this._requestHelper.workingRequestContext; }

    private readonly _roomBase = "room/";

    private get _roomBaseUrl() { return `${this._baseUrl}${this._roomBase}`}
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
import { BaseRequests } from "../Base/BaseRequests";
import { RequestHelper } from "../../helpers/RequestHelper";
import { RoomUrls } from "./RoomUrls";
import { CreateRoomPayload } from "../../customTypes/ApiPayloadTypes";

export class RoomRequests extends BaseRequests {

    private readonly _roomUrls;

    constructor(requestHelper: RequestHelper, baseUrl: string) {
        super(requestHelper);
        this._roomUrls = new RoomUrls(baseUrl);
    }

    async getRoom() {
        return this.workingRequest.get(this._roomUrls.serviceBaseUrl, { headers: this.extraHeaders });
    }

    async postRoom(payload: CreateRoomPayload) {
        return this.workingRequest.post(this._roomUrls.serviceBaseUrl, { data: payload, headers: this.extraHeaders });
    }

    async deleteRoom(roomId: number) {
        return this.workingRequest.delete(this._roomUrls.roomUrl(roomId), { headers: this.extraHeaders });
    }
}
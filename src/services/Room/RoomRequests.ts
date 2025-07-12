import { CreateRoomPayload } from "../../customTypes/ApiPayloadTypes";
import requestHelper from "../../helpers/channel/RequestHelper";
import roomUrls from "./RoomUrls";

const roomRequests = {
    getRoom() {
        return requestHelper.workingRequestContext.get(roomUrls.room(), { headers: requestHelper.getExtraHeaders() });
    },
    postRoom(payload: CreateRoomPayload) {
        return requestHelper.workingRequestContext.post(roomUrls.room(), { data: payload, headers: requestHelper.getExtraHeaders() });
    },
    deleteRoom(roomId: number) {
        return requestHelper.workingRequestContext.delete(roomUrls.roomUrl(roomId), { headers: requestHelper.getExtraHeaders() });
    }
};

export default roomRequests;
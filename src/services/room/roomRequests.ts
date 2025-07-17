import { CreateRoomPayload } from "../../types/apiPayloadTypes";
import requestHelper from "../../helpers/channel/requestHelper";
import roomEndpoints from "./roomEndpoints";

const roomRequests = {
    getRoom() {
        return requestHelper.workingRequestContext.get(roomEndpoints.room(), { headers: requestHelper.getExtraHeaders() });
    },
    postRoom(payload: CreateRoomPayload) {
        return requestHelper.workingRequestContext.post(roomEndpoints.room(), { data: payload, headers: requestHelper.getExtraHeaders() });
    },
    deleteRoom(roomId: number) {
        return requestHelper.workingRequestContext.delete(roomEndpoints.roomId(roomId), { headers: requestHelper.getExtraHeaders() });
    }
};

export default roomRequests;
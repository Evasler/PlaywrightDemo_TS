import { requestHelper } from "../../helpers/index.js";
import type { CreateRoomPayload } from "../../types/index.js";
import roomEndpoints from "./roomEndpoints.js";

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
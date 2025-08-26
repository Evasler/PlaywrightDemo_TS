import requestHelper from "../../helpers/channel/requestHelper.js";
import type { CreateRoomPayload } from "../../types/index.js";
import roomEndpoints from "./roomEndpoints.js";

const roomRequests = {
  room: {
    get() {
      return requestHelper.workingRequestContext.get(roomEndpoints.room(), {
        headers: requestHelper.getExtraHeaders(),
      });
    },
    post(payload: CreateRoomPayload) {
      return requestHelper.workingRequestContext.post(roomEndpoints.room(), {
        data: payload,
        headers: requestHelper.getExtraHeaders(),
      });
    },
  },
  roomId: {
    delete(roomId: number) {
      return requestHelper.workingRequestContext.delete(
        roomEndpoints.roomId(roomId),
        { headers: requestHelper.getExtraHeaders() },
      );
    },
  },
};

export default roomRequests;

import { frameworkDataHelper } from "../../helpers/index.js";

const roomEndpoints = {
    room() { return `${frameworkDataHelper.apiUrl}room/` },
    roomId(roomId: number) { return `${this.room()}${roomId}` }
};

export default roomEndpoints;
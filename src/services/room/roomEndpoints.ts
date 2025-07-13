import frameworkDataHelper from "../../helpers/data/frameworkDataHelper";

const roomEndpoints = {
    room() { return `${frameworkDataHelper.apiUrl}room/` },
    roomId(roomId: number) { return `${this.room()}${roomId}` }
};

export default roomEndpoints;
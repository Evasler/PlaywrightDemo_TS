import frameworkDataHelper from "../../helpers/data/frameworkDataHelper";

const roomUrls = {
    room() { return `${frameworkDataHelper.apiUrl}room/` },
    roomUrl(roomId: number) { return `${this.room()}${roomId}` }
};

export default roomUrls;
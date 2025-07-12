import frameworkDataHelper from "../../helpers/data/FrameworkDataHelper";

const roomUrls = {
    room() { return `${frameworkDataHelper.apiUrl}room/` },
    roomUrl(roomId: number) { return `${this.room()}${roomId}` }
};

export default roomUrls;
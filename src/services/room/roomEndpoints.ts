import { baseUrl } from "playwrap";

const roomEndpoints = {
  room() {
    return `${baseUrl()}api/room/`;
  },
  roomId(roomId: string) {
    return `${this.room()}${roomId}`;
  },
};

export default roomEndpoints;

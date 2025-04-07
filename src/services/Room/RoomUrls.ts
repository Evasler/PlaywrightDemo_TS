import { BaseUrls } from "../Base/BaseUrls";

export class RoomUrls extends BaseUrls {

    constructor(baseUrl: string) { super(baseUrl, "room/")}
    
    room() { return this.serviceBaseUrl }
    roomUrl(roomId: number) { return `${this.serviceBaseUrl}${roomId}` }
}
import BaseUrls from "../Base/BaseUrls";

export default class AuthUrls extends BaseUrls {

    constructor(baseUrl: string) { super(baseUrl, "auth/") }

    get login() { return `${this.serviceBaseUrl}login`}
    get validate() { return `${this.serviceBaseUrl}validate`}
    get logout() { return `${this.serviceBaseUrl}logout`}
}
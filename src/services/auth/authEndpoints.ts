import { frameworkDataHelper } from "../../helpers/index.js";

const authEndpoints = {
    auth() { return `${frameworkDataHelper.apiUrl}auth/` },
    login() { return `${this.auth()}login` },
    validate() { return `${this.auth()}validate` },
    logout() { return `${this.auth()}logout` }
};

export default authEndpoints;
import frameworkDataHelper from "../../helpers/data/FrameworkDataHelper";

const authUrls = {
    auth() { return `${frameworkDataHelper.apiUrl}auth/` },
    login() { return `${this.auth()}login` },
    validate() { return `${this.auth()}validate` },
    logout() { return `${this.auth()}logout` }
};

export default authUrls;
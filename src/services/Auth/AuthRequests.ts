import requestHelper from "../../helpers/channel/RequestHelper";
import authUrls from "./AuthUrls";

const authRequests = {
    login(payload: { username: string; password: string; }) {
        return requestHelper.workingRequestContext.post(authUrls.login(), { data: payload, headers: requestHelper.getExtraHeaders() });
    },
    validate(payload: { token: string })  {
        return requestHelper.workingRequestContext.post(authUrls.validate(), { data: payload, headers: requestHelper.getExtraHeaders() });
    },
    logout(payload: { token: string })  {
        return requestHelper.workingRequestContext.post(authUrls.logout(), { data: payload, headers: requestHelper.getExtraHeaders() });
    }
};

export default authRequests;
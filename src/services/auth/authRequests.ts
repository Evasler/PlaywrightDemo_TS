import requestHelper from "../../helpers/channel/requestHelper.js";
import authEndpoints from "./authEndpoints.js";

const authRequests = {
  login(payload: { username: string; password: string }) {
    return requestHelper.workingRequestContext.post(authEndpoints.login(), {
      data: payload,
      headers: requestHelper.getExtraHeaders(),
    });
  },
  validate(payload: { token: string }) {
    return requestHelper.workingRequestContext.post(authEndpoints.validate(), {
      data: payload,
      headers: requestHelper.getExtraHeaders(),
    });
  },
  logout(payload: { token: string }) {
    return requestHelper.workingRequestContext.post(authEndpoints.logout(), {
      data: payload,
      headers: requestHelper.getExtraHeaders(),
    });
  },
};

export default authRequests;

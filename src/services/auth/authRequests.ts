import requestHelper from "../../helpers/channel/requestHelper.js";
import authEndpoints from "./authEndpoints.js";

const authRequests = {
  login: {
    post(username: string, password: string) {
      return requestHelper.workingRequestContext.post(authEndpoints.login(), {
        data: {
          username: username,
          password: password,
        },
        headers: requestHelper.getExtraHeaders(),
      });
    },
  },
  validate: {
    post(token: string) {
      return requestHelper.workingRequestContext.post(
        authEndpoints.validate(),
        {
          data: {
            token: token,
          },
          headers: requestHelper.getExtraHeaders(),
        },
      );
    },
  },
};

export default authRequests;

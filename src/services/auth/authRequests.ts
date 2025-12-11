import { getExtraHeaders, workingRequestContext } from "playwrap";
import authEndpoints from "./authEndpoints.js";

const authRequests = {
  login: {
    post(username: string, password: string) {
      return workingRequestContext().post(authEndpoints.login(), {
        data: {
          username: username,
          password: password,
        },
        headers: getExtraHeaders(),
      });
    },
  },
  validate: {
    post(token: string) {
      return workingRequestContext().post(authEndpoints.validate(), {
        data: {
          token: token,
        },
        headers: getExtraHeaders(),
      });
    },
  },
};

export default authRequests;

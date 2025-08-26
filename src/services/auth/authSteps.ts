import { test } from "@playwright/test";
import { credentialsUtils } from "../../utils/index.js";
import testDataHelper from "../../helpers/data/testDataHelper.js";
import requestHelper from "../../helpers/channel/requestHelper.js";
import authResponses from "./authResponses.js";

const authSteps = {
  login(user: string) {
    return test.step(`Logging in as user "${user}"`, async () => {
      console.log(`Logging in as user "${user}"`);
      const credentials = credentialsUtils.getUserCredentials(user);
      const responseJson = await authResponses.login.post._200(
        credentials.username,
        credentials.password,
      );
      testDataHelper.pushTestData("token", responseJson.token);
      requestHelper.putExtraHeader("Cookie", `token=${responseJson.token}`);
    });
  },

  validate(tempDataIndex: number) {
    return test.step("Validating session token", async () => {
      const token = testDataHelper.getTestData("token", tempDataIndex);
      console.log(`Validating session token "${token}"`);
      await authResponses.validate.post._200(token);
    });
  },
};

export default authSteps;

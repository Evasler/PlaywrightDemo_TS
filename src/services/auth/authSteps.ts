import { test } from "@playwright/test";
import { credentialsUtils } from "../../utils/index.js";
import authResponses from "./authResponses.js";
import { getTestData, pushTestData, putExtraHeader } from "playwrap";
import type { TestDataKeys } from "../../types/index.js";

const authSteps = {
  login(user: string) {
    return test.step(`Logging in as user "${user}"`, async () => {
      console.log(`Logging in as user "${user}"`);
      const credentials = credentialsUtils.getUserCredentials(user);
      const responseJson = await authResponses.login.post._200(
        credentials.username,
        credentials.password,
      );
      pushTestData<TestDataKeys>("token", responseJson.token);
      putExtraHeader("Cookie", `token=${responseJson.token}`);
    });
  },

  validate(tempDataIndex: number) {
    return test.step("Validating session token", async () => {
      const token = getTestData<TestDataKeys>("token", tempDataIndex);
      console.log(`Validating session token "${token}"`);
      await authResponses.validate.post._200(token);
    });
  },
};

export default authSteps;

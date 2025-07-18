import extendedTest from "../../../../src/fixtures/extendedTest.js";
import requestHelper from "../../../../src/helpers/channel/requestHelper.js";
import authSteps from "../../../../src/services/auth/authSteps.js";
import testUtils from "../../../../src/utils/testUtils.js";

extendedTest(testUtils.fullTitle(0, "This Test should pass"), async() => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
});
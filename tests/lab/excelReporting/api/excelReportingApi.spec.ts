import extendedTest from "../../../../src/fixtures/extendedTest";
import requestHelper from "../../../../src/helpers/channel/requestHelper";
import authSteps from "../../../../src/services/auth/authSteps";
import testUtils from "../../../../src/utils/testUtils";

extendedTest(testUtils.fullTitle(0, "This Test should pass"), async() => {
    await requestHelper.openNewContext();
    await authSteps.login({ user: "administrator" });
});
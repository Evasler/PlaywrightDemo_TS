import apiTest from "../../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../../src/helpers/chaining/stepSequenceHelper";
import requestHelper from "../../../../src/helpers/channel/requestHelper";
import authSteps from "../../../../src/services/auth/authSteps";
import testUtils from "../../../../src/utils/testUtils";

apiTest(testUtils.fullTitle(0, "This Test should pass"), async() => {
    requestHelper.openNewContext();
    authSteps.login({ user: "administrator" });
    await stepSequenceHelper.stepSequence;
});
import apiTest from "../../../../src/fixtures/apiFixture";
import stepSequenceHelper from "../../../../src/helpers/chaining/StepSequenceHelper";
import requestHelper from "../../../../src/helpers/channel/RequestHelper";
import authSteps from "../../../../src/services/Auth/AuthSteps";
import testUtils from "../../../../src/utils/TestUtils";

apiTest(testUtils.fullTitle(0, "This Test should pass"), async() => {
    requestHelper.openNewContext();
    authSteps.login({ user: "administrator" });
    await stepSequenceHelper.stepSequence;
});
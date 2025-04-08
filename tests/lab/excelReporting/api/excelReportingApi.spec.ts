import apiTest from "../../../../src/fixtures/apiFixture";
import TestUtils from "../../../../src/utils/TestUtils";

apiTest(TestUtils.fullTitle(0, "This Test should pass"), async({ api }) => {
    await api
    ._openNewContext(api.serviceStepsHelper.authSteps)
    .login({ user: "administrator" })
    ._execute();
});
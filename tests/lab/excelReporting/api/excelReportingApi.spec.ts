import apiTest from "../../../../src/fixtures/apiFixture";
import TestUtils from "../../../../src/utils/TestUtils";

apiTest(TestUtils.fullTitle(0, "This Test should pass"), async({ api }) => {
    await api
    .openNewContext(api.serviceHelper.authService)
    .login({ user: "administrator" })
    .execute();
});
import apiTest from "../../../../src/fixtures/apiFixture";
import TestUtils from "../../../../src/utils/TestUtils";
import dataset from "./teardownStepsApi.data";

apiTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
apiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ api }) => {
    await api
    ._openNewContext(api.serviceStepsHelper.authSteps)
    .login(dataset.stepData.loginArgs)
    ._switchService(api.serviceStepsHelper.roomSteps)
    .createRoom(dataset.stepData.createRoomArgs)
    ._execute();
});
import { apiTest } from "../../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../../src/utils/TestUtils";
import { teardownStepsApiDataset as dataset } from "./teardownStepsApi.data";

apiTest.use({ teardownStepsArgsArray: dataset.teardownStepsArgsArray });
apiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ api }) => {
    await api
    .openNewContext(api.serviceHelper.authService)
    .login(dataset.stepData.loginArgs)
    .switchService(api.serviceHelper.roomService)
    .createRoom(dataset.stepData.createRoomArgs)
    .execute();
});
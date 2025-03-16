import { apiTest } from "../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../src/utils/TestUtils";
import { parameterizedTestsDatasets } from "../../../resources/testData/datasets/parameterizedTestsDataset";

for (const dataset of parameterizedTestsDatasets) {
    apiTest(TestUtils.buildTestTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ api }) => {
        await api
        .openNewContext(api.serviceHelper.authService)
        .login("administrator")
        .switchService(api.serviceHelper.roomService)
        .createRoom(dataset.stepData.roomDetails)
        .getRoomId(dataset.stepData.roomDetails.roomName, dataset.stepData.roomTempDataKeyPrefix)
        .deleteRoom(dataset.stepData.roomTempDataKeyPrefix)
        .execute();
    });
}
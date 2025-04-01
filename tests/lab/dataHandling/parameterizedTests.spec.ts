import { apiTest } from "../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../src/utils/TestUtils";
import { parameterizedTestsDatasets } from "../../../resources/testData/datasets/parameterizedTestsDataset";

for (const dataset of parameterizedTestsDatasets) {
    apiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ api }) => {
        await api
        .openNewContext(api.serviceHelper.authService)
        .login({ user: "administrator" })
        .switchService(api.serviceHelper.roomService)
        .createRoom({ payload: dataset.stepData.roomDetails })
        .getRoomId({ roomName: dataset.stepData.roomDetails.roomName, tempDataKeyPrefix: dataset.stepData.roomTempDataKeyPrefix })
        .deleteRoom({ tempDataKeyPrefix: dataset.stepData.roomTempDataKeyPrefix })
        .execute();
    });
}
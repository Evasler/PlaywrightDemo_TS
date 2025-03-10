import { test as apiTest } from "../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../src/utils/TestUtils";
import { parameterizedTestsDatasets } from "../../../resources/testData/datasets/parameterizedTestsDataset";

for (const dataset of parameterizedTestsDatasets) {
    apiTest(TestUtils.buildTestTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ serviceHelper }) => {
        await serviceHelper.authService
        .login("administrator")
        .switchServiceCategory(serviceHelper.roomService)
        .createRoom(
            dataset.stepData.roomDetails,
            dataset.stepData.roomTempDataKeyPrefix
        )
        .deleteRoom(dataset.stepData.roomTempDataKeyPrefix)
        .execute();
    });
}
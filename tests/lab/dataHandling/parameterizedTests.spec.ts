import apiTest from "../../../src/fixtures/apiFixture";
import TestUtils from "../../../src/utils/TestUtils";
import datasets from "./parameterizedTests.data";

for (const dataset of datasets) {
    apiTest(TestUtils.fullTitle(dataset.testDetails.id, dataset.testDetails.title, dataset.testDetails.suiteTags), async({ api }) => {
        await api
        ._openNewContext(api.serviceStepsHelper.authSteps)
        .login({ user: "administrator" })
        ._switchService(api.serviceStepsHelper.roomSteps)
        .createRoom({ payload: dataset.stepData.roomDetails })
        .getRoomId({ roomName: dataset.stepData.roomDetails.roomName })
        .deleteRoom({ tempDataIndex: dataset.stepData.roomTempDataIndex })
        ._execute();
    });
}
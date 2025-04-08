import apiTest from "../../../src/fixtures/apiFixture";
import TestUtils from "../../../src/utils/TestUtils";

apiTest(TestUtils.fullTitle(1, "Chained Function Object Model | StepSequenceBuilder"), async({ api }) => {
    await api
    ._openNewContext(api.serviceStepsHelper.authSteps)
    .login({ user: "administrator" })
    ._switchService(api.serviceStepsHelper.roomSteps)
    .createRoom({
        payload: {
            roomName: "998",
            type: "Double",
            accessible: false,
            description: "Double room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 350,
            features: ["TV"]
        }
    })
    ._openNewContext(api.serviceStepsHelper.authSteps)
    .login({ user: "administrator" })
    ._switchService(api.serviceStepsHelper.roomSteps)
    .createRoom({
        payload: {
            roomName: "999",
            type: "Family",
            accessible: false,
            description: "Family room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 400,
            features: ["Views"]
        }
    })
    ._execute();
});
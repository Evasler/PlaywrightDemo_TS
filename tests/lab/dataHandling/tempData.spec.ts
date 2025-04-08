import apiTest from "../../../src/fixtures/apiFixture";
import TestUtils from "../../../src/utils/TestUtils";

apiTest(TestUtils.fullTitle(1, "Temporary Data"), async({ api }) => {
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
    .getRoomId({ roomName: "998", tempDataKeyPrefix: "myFirstRoom" })
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
    .getRoomId({ roomName: "999", tempDataKeyPrefix: "mySecondRoom" })
    .deleteRoom({ tempDataKeyPrefix: "myFirstRoom" })
    .deleteRoom({ tempDataKeyPrefix: "mySecondRoom" })
    ._execute();
});
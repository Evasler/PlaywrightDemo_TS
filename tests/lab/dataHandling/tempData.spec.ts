import { test as apiTest } from "../../../src/fixtures/apiFixture";
import { TestUtils } from "../../../src/utils/TestUtils";

apiTest(TestUtils.buildTestTitle(1, "Temporary Data"), async({ serviceHelper }) => {
    await serviceHelper.authService
    .openNewContext(serviceHelper.authService)
    .login("administrator")
    .switchServiceCategory(serviceHelper.roomService)
    .createRoom(
        {
            roomName: "998",
            type: "Double",
            accessible: false,
            description: "Double room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 350,
            features: ["TV"]
        }
    )
    .getRoomId("998", "myFirstRoom")
    .createRoom(
        {
            roomName: "999",
            type: "Family",
            accessible: false,
            description: "Family room description",
            image: "https://www.mwtestconsultancy.co.uk/img/room1.jpg",
            roomPrice: 400,
            features: ["Views"]
        }
    )
    .getRoomId("999", "mySecondRoom")
    .deleteRoom("myFirstRoom")
    .deleteRoom("mySecondRoom")
    .execute();
});
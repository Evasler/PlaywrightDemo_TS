import browserHelper from "../../../../helpers/channel/browserHelper.js";

const roomsLocators = {
  link(name: string) {
    return browserHelper.workingTab.getByRole("link", {
      name: name,
      exact: true,
    });
  },
  row(
    roomName: string,
    type: string,
    accessible: string,
    price: string,
    roomDetails: string,
  ) {
    return browserHelper.workingTab.getByTestId("roomlisting").filter({
      hasText: new RegExp(
        `^${roomName}${type}${accessible}${price}${roomDetails}$`,
      ),
    });
  },
  deleteButton(
    roomName: string,
    type: string,
    accessible: string,
    price: string,
    roomDetails: string,
  ) {
    return this.row(roomName, type, accessible, price, roomDetails).locator(
      ".roomDelete",
    );
  },
};

export default roomsLocators;

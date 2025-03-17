import { BaseLocators } from "../../Base/BaseLocators";
import { BrowserHelper } from "../../../helpers/BrowserHelper";

export class AdminPanelLocators extends BaseLocators {

    constructor(browserHelper: BrowserHelper) { super(browserHelper) }

    link(name: string) { return this.workingTab.getByRole("link", {name: name, exact: true}); }

    row(roomName: string, type: string, accessible: string, price: string, roomDetails: string) {
        return this.workingTab.getByTestId("roomlisting").filter({ hasText: new RegExp(`^${roomName}${type}${accessible}${price}${roomDetails}$`)});
    }

    deleteButton(roomName: string, type: string, accessible: string, price: string, roomDetails: string) {
        return this.row(roomName, type, accessible, price, roomDetails).locator(".roomDelete");
    }
}
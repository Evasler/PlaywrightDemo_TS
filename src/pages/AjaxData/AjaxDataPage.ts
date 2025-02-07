import { TestManager } from "../../managers/TestManager";
import { BasePage } from "../Base/BasePage";

export class AjaxDataPage extends BasePage {

    constructor(testManager: TestManager) {
        super("AjaxPage", testManager);
    }
}
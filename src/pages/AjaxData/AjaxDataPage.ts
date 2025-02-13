import { StepSequenceManager } from "../../managers/StepSequenceManager";
import { TestManager } from "../../managers/TestManager";
import { BasePage } from "../Base/BasePage";

export class AjaxDataPage extends BasePage {

    constructor(testManager: TestManager, stepSequenceManager: StepSequenceManager) {
        super("AjaxPage", testManager, stepSequenceManager);
    }
}
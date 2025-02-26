import { StepSequenceHelper } from "../../helpers/StepSequenceHelper";
import { BrowserHelper } from "../../helpers/BrowserHelper";
import { BasePage } from "../Base/BasePage";
import { StorageStateHelper } from "../../helpers/StorageStateHelper";

export class AjaxDataPage extends BasePage {

    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, storageStateHelper: StorageStateHelper) {
        super("AjaxPage", browserHelper, stepSequenceHelper, storageStateHelper);
    }
}
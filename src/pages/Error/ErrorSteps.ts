import BrowserHelper from "../../helpers/channel/BrowserHelper";
import TempDataHelper from "../../helpers/chaining/TempDataHelper";
import StepSequenceHelper from "../../helpers/chaining/StepSequenceHelper";
import BasePageSteps from "../Base/BasePageSteps";

export default class ErrorSteps extends BasePageSteps {
    
    constructor(browserHelper: BrowserHelper, stepSequenceHelper: StepSequenceHelper, tempDataHelper: TempDataHelper) {
        super("Error", browserHelper, stepSequenceHelper, tempDataHelper);
    }
}
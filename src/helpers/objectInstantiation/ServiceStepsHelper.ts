import AuthSteps from "../../services/Auth/AuthSteps";
import RoomSteps from "../../services/Room/RoomSteps";
import StepSequenceHelper from "../chaining/StepSequenceHelper";
import RequestHelper from "../channel/RequestHelper";
import TempDataHelper from "../chaining/TempDataHelper";

/**
 * Instantiates all Steps objects used by the API Tests.
 * Holds a reference for all of those objects.
 */
export default class ServiceStepsHelper {

    private _authSteps?: AuthSteps;
    private _roomSteps?: RoomSteps;

    constructor(private readonly _requestHelper: RequestHelper, private readonly _stepSequenceHelper: StepSequenceHelper, private readonly _tempDataHelper: TempDataHelper, private readonly _baseUrl: string) { }
    
    get authSteps() {
        if (this._authSteps === undefined) {
            this._authSteps = new AuthSteps(this._requestHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._authSteps;
    }
    
    get roomSteps() {
        if (this._roomSteps === undefined) {
            this._roomSteps = new RoomSteps(this._requestHelper, this._stepSequenceHelper, this._tempDataHelper, this._baseUrl);
        }
        return this._roomSteps;
    }
}
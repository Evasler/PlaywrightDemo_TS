import { ServiceHelper } from "../helpers/ServiceHelper";
import { PageHelper } from "../helpers/PageHelper";
import { TempDataHelper } from "../helpers/TempDataHelper";

export type SharedUser = { sharedUser: string | undefined; };
export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
};
export type ErrorListenerOptionsObj = { errorListenerOptions: ErrorListenerOptions; };
export type PageHelperObj = { pageHelper: PageHelper; };
export type ServiceHelperObj = { serviceHelper: ServiceHelper; };
export type TempDataHelperObj = { tempDataHelper: TempDataHelper; };
import { ApiHelper } from "../helpers/ApiHelper";
import { PageHelper } from "../helpers/PageHelper";

export type PageType = "BlankPage" | "Login" | "AdminPanel" | "Error" | "HomePage" | "AjaxPage";
export type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";
export type SharedStorageStateEndpoints = {
    authentication: string;
    validation: string;
};
export type SharedStorageStateEndpointsObj = {
    sharedStorageStateEndpoints: SharedStorageStateEndpoints;
};
export type SharedStorageStateUser = { sharedStorageStateUser: string; };
export type ErrorListenerOptions = {
    failOnJsError: boolean;
    failOnConnectionError: boolean;
    failOnRequestError: boolean;
};
export type ErrorListenerOptionsObj = { errorListenerOptions: ErrorListenerOptions; };
export type PageHelperObj = { pageHelper: PageHelper; };
export type ApiHelperObj = { apiHelper: ApiHelper; };
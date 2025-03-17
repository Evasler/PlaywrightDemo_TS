import { StepsArgsArray } from "./StepArgsTypes";

export type PageType = "BlankPage" | "Login" | "AdminPanel" | "Error" | "HomePage" | "AjaxPage";
export type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";
export type SuiteTag = "@smoke" | "@regression" | "@fullScope";
export type StorageState = {
    cookies: {
        name: string,
        value: string,
        domain: string,
        path: string,
        expires: number,
        httpOnly: boolean,
        secure: boolean,
        sameSite: string
    }[],
    origins: []
}
export type TestDetailsObj = {
    testDetails: {
        id: number;
        title: string;
        suiteTags?: SuiteTag[];
    };
}
export type SetupStepsArgsObj = { setupStepsArgsArray?: StepsArgsArray };
export type TeardownStepsArgsObj = { teardownStepsArgsArray?: StepsArgsArray };
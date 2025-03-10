export type PageType = "BlankPage" | "Login" | "AdminPanel" | "Error" | "HomePage" | "AjaxPage";
export type LogLevel = "test" | "describe" | "specFile" | "fixture" | "projectDependency" | "reporter";
export type SuiteTag = "@smoke" | "@regression" | "@fullScope";
export type TestDetails = {
    testDetails: {
        id: number;
        title: string;
        suiteTags?: SuiteTag[];
    };
}
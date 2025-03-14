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
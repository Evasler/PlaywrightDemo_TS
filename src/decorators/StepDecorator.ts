import test from "@playwright/test";
import { BasePage } from "../pages/Base/BasePage";

export function step<T extends BasePage>() {
    return function actualDecorator<U extends (...args: any[]) => Promise<T>>(originalMethod: U, context: ClassMethodDecoratorContext) {
        return async function replacementMethod(this: any, ...args: any[]) {
            return await test.step(context.name.toString(), async () => {
                return await originalMethod.call(this, ...args);
            });
        }
    }
}
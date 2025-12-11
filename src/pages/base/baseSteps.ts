import {
  openNewTabInCurrentContext,
  openNewTabInNewContext,
  stepSequence,
  switchWorkingTab,
} from "playwrap";
import type { PageType } from "../../types/index.js";
import { openAuthorizedContext } from "../../helpers/auth/authenticationHelper.js";

export default abstract class BaseSteps {
  protected readonly _pageType: PageType;

  constructor(pageType: PageType) {
    this._pageType = pageType;
  }

  _openNewTabInNewContext<T extends BaseSteps>(
    page: T,
    authenticatedUser?: string,
  ): T {
    openNewTabInNewContext(
      async () => await openAuthorizedContext(authenticatedUser),
      this._pageType,
    );
    return page;
  }

  _openNewTabInCurrentContext<T extends BaseSteps>(page: T): T {
    openNewTabInCurrentContext(this._pageType);
    return page;
  }

  _switchWorkingTab<T extends BaseSteps>(
    contextIndex: number,
    pageIndex: number,
    page: T,
  ): T {
    switchWorkingTab(contextIndex, pageIndex, this._pageType, page._pageType);
    return page;
  }

  _execute() {
    return stepSequence();
  }
}

export type { BaseSteps };

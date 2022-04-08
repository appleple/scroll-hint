declare module 'scroll-hint' {

  interface i18n {
    scrollable: string
  }

  interface ScrollHintOption {
    suggestClass?: string,
    scrollableClass?: string,
    scrollableRightClass?: string,
    scrollableLeftClass?: string,
    scrollHintClass?: string,
    scrollHintIconClass?: string,
    scrollHintIconAppendClass?: string,
    scrollHintIconWrapClass?: string,
    scrollHintText?: string,
    scrollHintBorderWidth?: number,
    remainingTime?: string,
    enableOverflowScrolling?: boolean,
    applyToParents?: boolean,
    suggestiveShadow?: boolean,
    offset?: number,
    i18n?: i18n
  }

  export default class ScrollHint {
    constructor(selector: string | NodeListOf<HTMLElement>, option?:ScrollHintOption);
    updateItems(): void;
  }
}

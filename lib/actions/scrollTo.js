const runtimeHandler = require("../handlers/runtimeHandler");
const { findFirstElement } = require("../elementSearch");
const {
  defaultConfig,
  setNavigationOptions,
  setScrollOptions,
} = require("../config");
const { highlightElement } = require("../elements/elementHelper");
const { doActionAwaitingNavigation } = require("../doActionAwaitingNavigation");

const scrollToElement = async (element, options = {}) => {
  const scrollOptions = setScrollOptions(options);

  function scrollToNode(opt) {
    const element =
      this.nodeType === Node.TEXT_NODE ? this.parentElement : this;
    element.scrollIntoView({
      block: opt.blockAlignment,
      inline: opt.inlineAlignment,
    });
    return "result";
  }
  await runtimeHandler.runtimeCallFunctionOn(scrollToNode, null, {
    objectId: element.get(),
    arg: {
      blockAlignment: scrollOptions.blockAlignment,
      inlineAlignment: scrollOptions.inlineAlignment,
    },
  });
};

const scroll = async (e, px, scrollPage, scrollElement, direction) => {
  const _e = e || 100;
  if (Number.isInteger(_e)) {
    const res = await runtimeHandler.runtimeEvaluate(
      `(${scrollPage}).apply(null, ${JSON.stringify([_e])})`,
    );
    if (res.result.subtype === "error") {
      throw new Error(res.result.description);
    }
    return {
      description: `Scrolled ${direction} the page by ${_e} pixels`,
    };
  }

  const element = await findFirstElement(_e);
  if (defaultConfig.headful) {
    await highlightElement(element);
  }
  //TODO: Allow user to set options for scroll
  const options = setNavigationOptions({});
  await doActionAwaitingNavigation(options, async () => {
    const res = await runtimeHandler.runtimeCallFunctionOn(
      scrollElement,
      null,
      {
        objectId: element.get(),
        arg: px,
      },
    );
    if (res.result.subtype === "error") {
      throw new Error(res.result.description);
    }
  });
  const { description } = require("./pageActionChecks");
  return `Scrolled ${direction}${description(element, true)}by ${px} pixels`;
};

module.exports = { scrollToElement, scroll };

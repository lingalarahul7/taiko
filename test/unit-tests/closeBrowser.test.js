const expect = require("chai").expect;
const { openBrowser, closeBrowser } = require("../../lib/taiko");
const { openBrowserArgs } = require("./test-util");

xdescribe("close browser successfully", () => {
  before(async () => {
    expect(process.env.TAIKO_EMULATE_DEVICE).to.be.undefined;
    await openBrowser(openBrowserArgs);
  });

  it("closeBrowser should return 'Browser closed' message", async () => {
    await closeBrowser().then((data) => {
      expect(data).to.equal(undefined);
    });
  });
});

import { navigateTo } from "../support/page_objects/navigationPage";

describe("Test with Page Objects", () => {
  beforeEach("open application", () => {
    cy.visit("/");
  });

  it("verify navigations actions the pages", () => {
    navigateTo.formLayoutsPage();
    navigateTo.datepickerPage();
    navigateTo.smartTablePage();
    navigateTo.tooltipPage();
    navigateTo.toasterPage();
  });
});

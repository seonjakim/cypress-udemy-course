import { onDatePickerPage } from "../support/page_objects/datepickerPage";
import { onFormLayoutsPage } from "../support/page_objects/formLayoutsPage";
import { navigateTo } from "../support/page_objects/navigationPage";
import { onSmartTablePage } from "../support/page_objects/smartTablePage";

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

  it("should submit Inline and Basic from and select tmr date in the calendar", () => {
    navigateTo.formLayoutsPage();
    onFormLayoutsPage.submitInlineFormWithNameAndEmail(
      "Artem",
      "test@test.com"
    );
    onFormLayoutsPage.submitBasicFormWithEmailAndPassword(
      "test@test.com",
      "password"
    );

    navigateTo.datepickerPage();
    onDatePickerPage.selectCommonDatepickerDateFromToday(1);
    onDatePickerPage.selectDatepickerWithRangeFromToday(7, 14);

    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName("Artem", "Bondar");
    onSmartTablePage.updateAgeByFirstName("Artem", "35");
    onSmartTablePage.deleteRowByIndex(1);
  });
});

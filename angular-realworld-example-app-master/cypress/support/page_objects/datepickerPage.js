function selectDayFromCurrent(day) {
  let date = new Date();
  date.setDate(date.getDate() + day);

  let futureDay = date.getDate();
  let futureMonth = date.toLocaleString("default", { month: "short" });
  let dateAssert = futureMonth + " " + futureDay + ", " + date.getFullYear();
  cy.get("nb-calendar-navigation")
    .invoke("attr", "ng-reflect-date")
    .then((date) => {
      if (!date.includes(futureMonth)) {
        cy.get('[date-name="chevron-right"]').click();
        selectDayFromCurrent(day);
      }
      cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
    });
  return dateAssert;
}

export class DatepickerPage {
  selectCommonDatepickerDateFromToday(dayFromToday) {
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        const dateAssert = selectDayFromCurrent(dayFromToday);
        cy.wrap(input).invoke("prop", "value").should("contain", dateAssert);
        cy.wrap(input).should("have.value", dateAssert);
      });
  }

  selectDatepickerWithRangeFromToday(firstDay, secondDay) {
    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        const dateAssertFirst = selectDayFromCurrent(firstDay);
        const dateAssertSecond = selectDayFromCurrent(secondDay);
        const finalDate = `${dateAssertFirst} - ${dateAssertSecond}`;
        cy.wrap(input).invoke("prop", "value").should("contain", finalDate);
        cy.wrap(input).should("have.value", finalDate);
      });
  }
}

export const onDatePickerPage = new DatepickerPage();

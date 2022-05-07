/// <reference types="cypress" />

describe("Our first suite", () => {
  it("first test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
    // by Tag name
    cy.get("input");
    // by Id
    cy.get("#inputEmail1");
    // by Class name
    cy.get(".input-full-width");
    // by Attribute name
    cy.get("[placeholder]");
    // by Attribute name and value
    cy.get('[placeholder="Email"]');
    // by Class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');
    // by Tag name and Attribute with value
    cy.get('input[placeholder="Email"]');
    // by two different attributes
    cy.get('[placeholder="Email"][fullwidth]');
    // by tag name, Attribute with value, ID and Class name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');
    // The most recommended way by cypress
    cy.get('[data-cy="imputEmail1"]');
  });

  it("second test", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();
    cy.get('[data-cy="signInButton"]');
    cy.contains("Sign in");
    cy.contains('[status="warning"]', "Sign in");

    cy.get("#inputEmail3")
      .parents("form")
      .find("button") // find always inside parents element
      .should("contain", "Sign in")
      .parents("form")
      .find("nb-checkbox")
      .click();

    cy.contains("nb-card", "Horizontal from") // text with tag name
      .find('[type="email"]');
  });

  it.only("then and wrap methods", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputEmail1"]')
      .should("contain", "Email");

    cy.contains("nb-card", "Using the Grid")
      .find('[for="inputPassword2"]')
      .should("contain", "Password");

    // remove duplication
    // cypress is syncronous so cannot save as variables
    cy.contains("nb-card", "Using the Grid").then((firstForm) => {
      // when use 'then' the function become jQuery object so that you have to treat it as one
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text();
      const pw = firstForm.find('[for="inputPassword2"]').text();
      expect(emailLabelFirst).to.equal("Email");
      expect(pw).to.equal("Password");

      cy.contains("nb-card", "Basic form").then((secondForm) => {
        const email = secondForm.find('[for="exampleInputEmail1"]').text();
        expect(emailLabelFirst).to.equal(email);

        // if you wrap() you can use cypress method!
        cy.wrap(secondForm)
          .find('[for="exampleInputEmail1"]')
          .should("contain", "Email");
      });
    });
  });

  it.only("invoke command", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // 1
    cy.get('[for="exampleInputEmail1"]').should("contain", "Email address");

    // 2
    cy.get('[for="exampleInputEmail1"]').then((label) => {
      expect(label.text()).to.equal("Email address");
    });

    // 3
    cy.get('[for="exampleInputEmail1"]')
      .invoke("text") // you can grab some as a parameter
      .then((text) => {
        expect(text).to.equal("Email address");
      });

    cy.contains("nb-card", "Basic form")
      .find("nb-checkbox")
      .click()
      .find(".custom-checkbox")
      .invoke("attr", "class")
      //.should("contain", "checked");
      .then((classVal) => {
        expect(classVal).to.contain("checked");
      });
  });

  it.only("assert property", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Datepicker").click();

    cy.contains("nb-card", "Common Datepicker")
      .find("input")
      .then((input) => {
        cy.wrap(input).click();
        cy.get("nb-calendar-day-picker").contains("17").click();
        cy.wrap(input)
          .invoke("prop", "value")
          .should("contain", "Dec 17, 2019");
      });
  });

  it.only("radio button", () => {
    cy.visit("/");
    cy.contains("Forms").click();
    cy.contains("Form Layouts").click();

    // gonna return 3 elements
    cy.contains("nb-card", "Using the Grid")
      .find('[type="radio"]')
      .then((radio) => {
        cy.wrap(radio).first().check({ force: true }).should("be.checked");
        // element with index
        cy.wrap(radio).eq(1).check({ force: true });

        cy.wrap(radio).first().should("not.be.checked");

        cy.wrap(radio).eq(2).should("be.disabled");
      });
  });

  it.only("check boxes", () => {
    cy.visit("/");
    cy.contains("Modal & Overlays").click();
    cy.contains("Toaster").click();

    // check all the check box not like click
    // check only for radio or checkbox
    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('[type="checkbox"]').eq(0).click({ force: true });
  });

  it.only("list and dropdowns", () => {
    cy.visit("/");

    cy.get("nav nb-select").click();
    cy.get(".options-list").contains("Dark").click();
    cy.get("nav nb-select").should("contain", "Dark");
    cy.get("nb-layout-header nav").should(
      "have.css",
      "background-color",
      "rgb(34, 43, 69)"
    );

    // remove duplication for dropdowns

    cy.get("nav nb-select").then((dropdown) => {
      cy.wrap(dropdown).click();
      cy.get(".options-list nb-option") // interation
        .each((list, index) => {
          const text = list.text().trim(); //remove space
          const colors = {
            Light: "rgb(255, 255, 255)",
            Dark: "rgb(34, 43, 69)",
            Cosmic: "rgb(50, 50, 89)",
            Corporate: "rgb(255, 255, 255)",
          };
          cy.wrap(text).click();
          cy.wrap(dropdown).should("contain", text);
          cy.get("nb-layout-header nav").should(
            "have.css",
            "background-color",
            colors[text] // interation
          );
          if (index < 3) cy.wrap(dropdown).click();
        });
    });
  });
});

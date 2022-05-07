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
});

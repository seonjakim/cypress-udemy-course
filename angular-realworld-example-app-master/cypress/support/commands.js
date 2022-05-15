// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginToApplication", () => {
  const userCredentials = {
    user: {
      email: "artem.bondar16@gmail.com",
      password: "CypressTest1",
    },
  };

  // Headless Authorization
  // this way we do not need to login everytime so it is faster!
  cy.request(
    "POST",
    "https://conduit.productionready.io/api/users/login",
    userCredentials
  )
    .its("body")
    .then((body) => {
      const token = body.user.token;
      cy.wrap(token).as("token"); // make token as a global alias
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("jwtToken", token);
        },
      });
    });
});

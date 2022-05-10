///<reference types="cypress" />

describe("Test with backend", () => {
  beforeEach("login to the app", () => {
    cy.loginToApplication();
  });

  it("verify correct request and response", () => {
    // below deplicated methods
    cy.server(); // create server
    cy.route("POST", "**/articles").as("postArticles"); // post /articles endpoint api and save the data as 'postArticles'

    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is a title");
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the Article");
    cy.contains("Publish Article").click();

    cy.wait("@postArticles"); // wait till the call is completed
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.status).to.equal(200);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the Article"
      );
      expect(xhr.reponse.body.article.description).to.equal(
        "This is a description"
      );
    });
  });
});

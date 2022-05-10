///<reference types="cypress" />

describe("Test with backend", () => {
  beforeEach("login to the app", () => {
    cy.server();
    cy.route("GET", "**/tags", "fixture:tags.json");
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

  it("should gave tags with routing object", () => {
    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "automation")
      .and("contain", "testing");
  });

  it("verify global feed likes count", () => {
    cy.route("GET", "**/articles/feed*", '{"articles":[],"articlesCount":0}');
    cy.route("GET", "**/articles*", "fixture:articles.json");

    cy.contains("Global Feed").click();
    cy.get("app-article-list button").then((buttons) => {
      expect(buttons[0]).to.contain("1");
      expect(buttons[1]).to.contain("5");
    });

    cy.fixture("articles").then((file) => {
      const id = file.articles[0].slug;
      cy.route("POST", `**/articles/${id}/favorite`, file);
    });

    cy.get("app-article-list button").eq(0).click().should("contain", "1");
  });
});

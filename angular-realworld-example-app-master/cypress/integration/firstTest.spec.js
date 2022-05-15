///<reference types="cypress" />

describe("Test with backend", () => {
  beforeEach("login to the app", () => {
    cy.intercept({ method: "GET", path: "tags" }, { fixture: "tags.json" });
    cy.loginToApplication();
  });

  it("verify correct request and response", () => {
    // below deplicated methods

    cy.intercept("POST", "**/articles").as("postArticles"); // post /articles endpoint api and save the data as 'postArticles'

    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is a title");
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the Article");
    cy.contains("Publish Article").click();

    cy.wait("@postArticles"); // wait till the call is completed
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the Article"
      );
      expect(xhr.reponse.body.article.description).to.equal(
        "This is a description"
      );
    });
  });

  it("intercepting and modifying the request and response", () => {
    // request modify
    cy.intercept("POST", "**/articles", (req) => {
      req.body.article.description = "This is a description 2"; // intercept the request of POST and can modify it!!
    }).as("postArticles");
    // response modify
    cy.intercept("POST", "**/articles", (req) => {
      req.reply((res) => {
        expect(res.body.article.description).to.equal("This is a description");
        res.body.article.description = "This is a description 2";
      });
    }).as("postArticles");

    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is a title");
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the Article");
    cy.contains("Publish Article").click();

    cy.wait("@postArticles"); // wait till the call is completed
    cy.get("@postArticles").then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the Article"
      );
      expect(xhr.reponse.body.article.description).to.equal(
        "This is a description 2"
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
    cy.intercept("GET", "**/articles/feed*", {
      articles: [],
      articlesCount: 0,
    });
    cy.intercept("GET", "**/articles*", { fixture: "articles.json" });

    cy.contains("Global Feed").click();
    cy.get("app-article-list button").then((buttons) => {
      expect(buttons[0]).to.contain("1");
      expect(buttons[1]).to.contain("5");
    });

    cy.fixture("articles").then((file) => {
      const id = file.articles[0].slug;
      cy.intercept("POST", `**/articles/${id}/favorite`, file);
    });

    cy.get("app-article-list button").eq(0).click().should("contain", "1");
  });

  it("delete a new article in a global feed", () => {
    const userCredentials = {
      user: {
        email: "artem.bondar16@gmail.com",
        password: "CypressTest1",
      },
    };

    const bodyRequest = {
      article: {
        tagList: [],
        title: "Request from API",
        description: "API testing is easy",
        body: "Angular is cool",
      },
    };
    cy.request(
      "POST",
      "https://conduit.productionready.io/api/users/login",
      userCredentials
    )
      .its("body")
      .then((body) => {
        const token = body.user.token;

        cy.request({
          url: "https://conduit.productionready.io/api/articles/",
          headers: { Authrization: "Token " + token },
          method: "POST",
          body: bodyRequest,
        }).then((res) => {
          expect(res.status).to.equal(200);
        });

        cy.contains("Global Feed").click();
        cy.get(".article-preview").first().click();
        cy.get(".article-actions").contains("Delete Article").click();

        cy.request({
          url:
            "https://conduit.productionready.io/api/articles?limit=10&offset=0",
          headers: { Authrization: "Token " + token },
          method: "GET",
        })
          .its("body")
          .then((body) => {
            expect(body.articles[0].title).not.to.equal("Request from API");
          });
      });
  });
});

describe("Testing ALL APIs: Demonstrating API Request Chaining", () => {
  const generate10DigitContact = () => Math.floor(1000000000 + Math.random() * 9000000000);
  const generate3Digit = () => Math.floor(100 + Math.random() * 900);
  const randomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const contact = generate10DigitContact();
  const firstName = randomString(3);
  const lastName = randomString(3);
  const email = `${firstName}.${lastName}@example.com`;
  const password = randomString(6);
  const applicationstatus = "PENDING"; 
  const country = randomString(3);
  const socialid = generate3Digit() + lastName + country;
  const accounttype = "SAVINGS"; 
  const annualincome = "58000"; 
  const drivinglicence = "DL-" + socialid; 
  const occupation = "Engineer"; 
  const ongoingloans = "0";
  const passportnumber = "P" + socialid; 
  const taxid = "TAX" + socialid;

  it("Request Chaining all APIs", () => {
    // Step 1: POST /addRegister
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addRegister`,
      body: { contact, firstName, lastName, email, password },
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, firstName, lastName, email });
    });

    cy.wait(2000);

    // Step 2: GET /registerByContact
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registerByContact`,
      qs: { contact: 6087654321 }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact: 6087654321,
        firstName: "Alan",
        lastName: "Collins",
        email: "alan.collins@example.com",
        password: "collins123"
      });
    });

    cy.wait(2000);

    // Step 3: GET /registers
    cy.request("GET", `${Cypress.config().baseUrl}/registers`).then((res) => {
      expect(res.status).to.eq(200);
      const user = res.body.find(u => u.contact === contact);
      expect(user).to.include({ firstName, lastName, email });
    });

    cy.wait(2000);

    // Step 4: POST /addApplication
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addApplication`,
      body: { contact, password, accounttype, country, socialid },
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, accounttype, country, socialid, applicationstatus });
      expect(res.body.password).to.be.null;
    });

    cy.wait(2000);

    // Step 5: GET /applicationByContact
    cy.request("GET", `${Cypress.config().baseUrl}/applicationByContact/${contact}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({ contact, accounttype, country, socialid, applicationstatus });
      expect(res.body.password).to.be.null;
    });

    cy.wait(2000);

    // Step 6: GET /applications
    cy.request("GET", `${Cypress.config().baseUrl}/applications`).then((res) => {
      expect(res.status).to.eq(200);
      const app = res.body.find(u => u.contact === contact);
      expect(app).to.include({ socialid, applicationstatus });
    });

    cy.wait(2000);

    // Step 7: POST /kycDataCapture
    const kycPayload = { contact, password, socialid, annualincome, taxid, drivinglicence, passportnumber, occupation, ongoingloans };
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/kycDataCapture`,
      body: kycPayload,
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include(kycPayload);
    });

    cy.wait(2000);

    // Step 8: POST /kycVerification
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/kycVerification`,
      body: kycPayload,
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact, firstName, lastName, email, password, socialid,
        applicationstatus: "ACTIVE", balance: "2000.0", kycstatus: "ACTIVE"
      });
    });

    cy.wait(2000);

    // Step 9: POST /deposit
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/deposit`,
      body: { contact, password, amount: 1000.00 },
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact, txntype: "DEPOSIT", amount: 1000.00, password: null
      });
    });

    cy.wait(2000);

    // Step 10: POST /withdraw
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/withdraw`,
      body: { contact, password, amount: 2000.00 },
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact, txntype: "WITHDRAW", amount: 2000.00, password: null
      });
    });

    cy.wait(2000);

    // Step 11: POST /transferFund
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/transferFund/6087654321`,
      body: { contact, password, amount: 500.00 },
      timeout: 90000,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.include({
        contact: 6087654321, txntype: "TRANSFER_IN", amount: 500.00, password: null
      });
    });

    cy.wait(2000);

    // Step 12: GET /displayStatement (with JSON Schema validation)
    const Ajv = require("ajv");
    const ajv = new Ajv();
    const transactionSchema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "array",
      items: {
        type: "object",
        required: ["id", "contact", "txntype", "amount", "balanceAfter", "txnTime", "password"],
        properties: {
          id: { type: "number" },
          contact: { type: "number" },
          txntype: { type: "string" },
          amount: { type: "number" },
          balanceAfter: { type: "number" },
          txnTime: { type: "string" },
          password: {}
        }
      }
    };

    cy.request("GET", `${Cypress.config().baseUrl}/displayStatement/${contact}?password=${password}`).then((res) => {
      expect(res.status).to.eq(200);
      const isValid = ajv.validate(transactionSchema, res.body);
      if (!isValid) console.error("Schema validation failed:", ajv.errors);
      expect(isValid).to.be.true;
    });
  });
});

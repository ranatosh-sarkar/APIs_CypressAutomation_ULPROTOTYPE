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

  const safePost = (endpoint, body) => {
    cy.log(`🚀 POST ${endpoint}`);
    return cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}${endpoint}`,
      headers: {
        "Content-Type": "application/json"
      },
      body,
      timeout: 90000,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 200) {
        cy.log(`❌ ${endpoint} failed with status ${response.status}`);
        cy.log(`Response: ${JSON.stringify(response.body)}`);
        throw new Error(`${endpoint} failed`);
      }
      return response;
    });
  };

  it("Request Chaining all APIs", () => {
    safePost("/addRegister", { contact, firstName, lastName, email, password }).then((response) => {
      expect(response.body.contact).to.eq(contact);
    });

    cy.wait(3000);

    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registerByContact`,
      qs: { contact: 6087654321 }
    }).then((res) => expect(res.status).to.eq(200));

    cy.wait(3000);

    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registers`
    }).then((res) => {
      expect(res.status).to.eq(200);
      const newUser = res.body.find(u => u.contact === contact);
      expect(newUser).to.exist;
    });

    cy.wait(3000);

    safePost("/addApplication", { contact, password, accounttype, country, socialid }).then((res) => {
      expect(res.body.socialid).to.eq(socialid);
    });

    cy.wait(3000);

    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/applicationByContact/${contact}`
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.socialid).to.eq(socialid);
    });

    cy.wait(3000);

    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/applications`
    }).then((res) => {
      expect(res.status).to.eq(200);
      const match = res.body.find(u => u.contact === contact);
      expect(match).to.exist;
    });

    cy.wait(3000);

    safePost("/kycDataCapture", {
      contact, password, socialid, annualincome,
      taxid, drivinglicence, passportnumber, occupation, ongoingloans
    }).then((res) => {
      expect(res.body.taxid).to.eq(taxid);
    });

    cy.wait(3000);

    safePost("/kycVerification", {
      contact, password, socialid, annualincome,
      taxid, drivinglicence, passportnumber, occupation, ongoingloans
    }).then((res) => {
      expect(res.body.kycstatus).to.eq("ACTIVE");
    });

    cy.wait(3000);

    safePost("/deposit", {
      contact, password, amount: 1000.00
    }).then((res) => {
      expect(res.body.txntype).to.eq("DEPOSIT");
    });

    cy.wait(3000);

    safePost("/withdraw", {
      contact, password, amount: 2000.00
    }).then((res) => {
      expect(res.body.txntype).to.eq("WITHDRAW");
    });

    cy.wait(3000);

    safePost(`/transferFund/6087654321`, {
      contact, password, amount: 500.00
    }).then((res) => {
      expect(res.body.txntype).to.eq("TRANSFER_IN");
    });

    cy.wait(3000);

    const Ajv = require("ajv");
    const ajv = new Ajv();
    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          contact: { type: "number" },
          txntype: { type: "string" },
          amount: { type: "number" },
          balanceAfter: { type: "number" },
          txnTime: { type: "string" },
          password: {}
        },
        required: ["id", "contact", "txntype", "amount", "balanceAfter", "txnTime", "password"]
      }
    };

    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/displayStatement/${contact}?password=${password}`
    }).then((res) => {
      expect(res.status).to.eq(200);
      const validate = ajv.compile(schema);
      const isValid = validate(res.body);
      expect(isValid).to.be.true;
    });
  });
});

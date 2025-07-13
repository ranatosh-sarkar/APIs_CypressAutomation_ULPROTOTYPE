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
    const country = randomString(3);;
    const socialid = generate3Digit() + lastName + country; 
    const accounttype = "SAVINGS"; 
    const annualincome = "58000"; 
    const drivinglicence = "DL-"+ socialid; 
    const occupation = "Engineer"; 
    const ongoingloans = "0";
    const passportnumber = "P"+socialid; 
    const taxid = "TAX"+socialid;

    // const contact = 3291063469;
    // const firstName = "ymq";
    // const lastName = "qds";
    // const email = "ymq.qds@example.com";
    // const password = "feepru";
    // const applicationstatus = "PENDING"; 
    // const country = "IRE";
    // const socialid = "325qdsIRE"; 
    // const accounttype = "SAVINGS"; 
    // const annualincome = "58000"; 
    // const drivinglicence = "DL-325qdsIRE"; 
    // const occupation = "Engineer"; 
    // const ongoingloans = "0";
    // const passportnumber = "P325qdsIRE"; 
    // const taxid = "TAX325qdsIRE";

    it("Request Chaining all APIs", () => {

    console.log("Hitting /addRegister api");
    cy.log("Hitting /addRegister api");
    // console.log(`FirstName: ${firstName}, Contact: ${contact}, Password: ${password}`);
    // cy.log(`FirstName: ${firstName}, Contact: ${contact}, Password: ${password}`);

    const requestBody_addRegister = {
      contact,
      firstName,
      lastName,
      email,
      password
    };
    // Step 1: POST /addRegister
    cy.request({
      method: "POST",
      url: `${Cypress.config().baseUrl}/addRegister`,
      body: requestBody_addRegister
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.contact).to.eq(contact);
      expect(response.body.firstName).to.eq(firstName);
      expect(response.body.lastName).to.eq(lastName);
      expect(response.body.email).to.eq(email);
      expect(response.body.password).to.eq(password);
      console.log(`/addRegister: passed successfully`);
      cy.log(`/addRegister: passed successfully`);
    });

    cy.wait(3000);

    // Step 2: GET /registerByContact
    console.log("Hitting /registerByContact api");
    cy.log("Hitting /registerByContact api");
    const registerByContactNumber = 6087654321;
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registerByContact`,
      qs: { contact: registerByContactNumber } // query parameter
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.contact).to.eq(registerByContactNumber);
      expect(response.body.firstName).to.eq("Alan");
      expect(response.body.lastName).to.eq("Collins");
      expect(response.body.email).to.eq("alan.collins@example.com");
      expect(response.body.password).to.eq("collins123");
      console.log(`/registerByContact: query parameter passed successfully`);
      cy.log(`/registerByContact: query parameter passed successfully`);
    });

    cy.wait(3000);

    // Step 3: GET /registers
    console.log("Hitting /registers api");
    cy.log("Hitting /registers api");
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/registers`
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      expect(getResponse.body).to.be.an("array");

      const newUser = getResponse.body.find(u => u.contact === contact);
      expect(newUser).to.exist;
      expect(newUser.firstName).to.eq(firstName);
      expect(newUser.lastName).to.eq(lastName);
      expect(newUser.email).to.eq(email);
      console.log(`/registers: passed successfully`);
      cy.log(`/registers: passed successfully`);
    });

    cy.wait(3000);

    // Step 4: POST /addApplication
    console.log("Hitting /addApplication api");
    cy.log("Hitting /addApplication api");
    const requestBody_addApplication = {
      contact,
      password,
      accounttype,
      country,
      socialid
    };

    cy.request({
            method: "POST",
            url: `${Cypress.config().baseUrl}/addApplication`,
            body: requestBody_addApplication
        }).then((response) => {
    
        expect(response.status).to.eq(200);
        // Parse and validate response body
        const responseBody = response.body;
        expect(responseBody).to.have.property("contact", contact);
        expect(responseBody).to.have.property("accounttype", accounttype);
        expect(responseBody).to.have.property("country", country);
        expect(responseBody).to.have.property("socialid", socialid);
        expect(responseBody).to.have.property("applicationstatus", applicationstatus);

        // Optional field check: password might be null
        expect(responseBody).to.have.property("password");
        expect(responseBody.password).to.be.null;

        console.log(`/addApplication: JSON parsing passed successfully`);
        cy.log(`/addApplication: JSON parsing passed successfully`);
        });

    cy.wait(3000);

    // Step 5: GET /applicationByContact
    console.log("Hitting /addApplicationByContact api");
    cy.log("Hitting /addApplicationByContact api");
    const contactNumber = contact;

    cy.request({
                method: "GET",
                url: `${Cypress.config().baseUrl}/applicationByContact/${contactNumber}`
               }).then((response) => {
  
                expect(response.status).to.eq(200);

                // JSON response body parsing and assertions
                const responseBody = response.body;

                expect(responseBody).to.have.property("contact", contact);
                expect(responseBody).to.have.property("accounttype", "SAVINGS");
                expect(responseBody).to.have.property("country", country);
                expect(responseBody).to.have.property("socialid", socialid);
                expect(responseBody).to.have.property("applicationstatus", "PENDING");

                expect(responseBody).to.have.property("password");
                expect(responseBody.password).to.be.null;

                console.log(`/applicationByContact/${contactNumber} -- path variable passed successfully`);
                cy.log(`/applicationByContact/${contactNumber} -- path variable passed successfully`);
            });

    cy.wait(3000);

    // Step 6: GET /applications
    console.log("Hitting /applications api");
    cy.log("Hitting /applications api");
    cy.request({
      method: "GET",
      url: `${Cypress.config().baseUrl}/applications`
    }).then((getResponse) => {
      expect(getResponse.status).to.eq(200);
      expect(getResponse.body).to.be.an("array");

      const newUser = getResponse.body.find(u => u.contact === contact);
      expect(newUser).to.exist;
      expect(newUser.socialid).to.eq(socialid);
      expect(newUser.applicationstatus).to.eq("PENDING");
      console.log(`/applications: passed successfully`);
      cy.log(`/applications: passed successfully`);
    });

    cy.wait(3000);

    // Step 7: POST /kycDataCapture
    console.log("Hitting /kycDataCapture API");
    cy.log("Hitting /kycDataCapture API");

        const requestBody_kycDataCapture = {
        contact,
        password,
        socialid,
        annualincome,
        taxid,
        drivinglicence,
        passportnumber,
        occupation,
        ongoingloans
    };

        cy.request({
            method: "POST",
            url: `${Cypress.config().baseUrl}/kycDataCapture`,
            body: requestBody_kycDataCapture
        }).then((response) => {
        expect(response.status).to.eq(200);
        const responseBody = response.body;
        expect(responseBody).to.have.property("contact", contact);
        expect(responseBody).to.have.property("password", password);
        expect(responseBody).to.have.property("socialid", socialid);
        expect(responseBody).to.have.property("annualincome", annualincome);
        expect(responseBody).to.have.property("taxid", taxid);
        expect(responseBody).to.have.property("drivinglicence", drivinglicence);
        expect(responseBody).to.have.property("passportnumber", passportnumber);
        expect(responseBody).to.have.property("occupation", occupation);
        expect(responseBody).to.have.property("ongoingloans", ongoingloans);

        console.log(`/kycDataCapture: ${contact} -- KYC data captured and validated successfully`);
        cy.log(`/kycDataCapture: ${contact} -- KYC data captured and validated successfully`);
    });

    cy.wait(3000);

    // Step 8: POST /kycVerification
    console.log("Hitting /kycVerification API");
    cy.log("Hitting /kycVerification API");

    const requestBody_kycVerification = {
        contact,
        password,
        socialid,
        annualincome,
        taxid,
        drivinglicence,
        passportnumber,
        occupation,
        ongoingloans
    };

        cy.request({
            method: "POST",
            url: `${Cypress.config().baseUrl}/kycVerification`,
            body: requestBody_kycVerification
        }).then((response) => {

        expect(response.status).to.eq(200);
        const responseBody = response.body;
        expect(responseBody).to.have.property("contact", contact);
        expect(responseBody).to.have.property("firstName", firstName);
        expect(responseBody).to.have.property("lastName", lastName);
        expect(responseBody).to.have.property("email", email);
        expect(responseBody).to.have.property("password", password);
        expect(responseBody).to.have.property("socialid", socialid);
        expect(responseBody).to.have.property("applicationstatus", "ACTIVE");
        expect(responseBody).to.have.property("balance", "2000.0");
        expect(responseBody).to.have.property("kycstatus", "ACTIVE");

        console.log(`/kycVerification: KYC verification passed successfully`);
        cy.log(`/kycVerification: KYC verification passed successfully`);
   });

    cy.wait(3000);

    // Step 9: POST /deposit
    console.log("Hitting /deposit API");
    cy.log("Hitting /deposit API");

    const requestBody_deposit = {
            contact,
            password,
            amount: 1000.00
        };

    cy.request({
            method: "POST",
            url: `${Cypress.config().baseUrl}/deposit`,
            body: requestBody_deposit
        }).then((response) => {

        expect(response.status).to.eq(200);
        const responseBody = response.body;

        expect(responseBody).to.have.property("id");
        expect(responseBody).to.have.property("contact", contact);
        expect(responseBody).to.have.property("txntype", "DEPOSIT");
        expect(responseBody).to.have.property("amount", 1000.0);
        expect(responseBody).to.have.property("password", null);

        console.log(`/deposit: deposit transaction passed successfully`);
        cy.log(`/deposit: deposit transaction passed successfully`);
    });

    cy.wait(3000);

    // Step 10: POST /withdraw
    console.log("Hitting /withdraw API");
    cy.log("Hitting /withdraw API");

    const requestBody_withdraw = {
                contact,
                password,
                amount: 2000.00
            };

    cy.request({
                method: "POST",
                url: `${Cypress.config().baseUrl}/withdraw`,
                body: requestBody_withdraw
            }).then((response) => {

        expect(response.status).to.eq(200);
        const responseBody = response.body;

        expect(responseBody).to.have.property("id");
        expect(responseBody).to.have.property("contact", contact);
        expect(responseBody).to.have.property("txntype", "WITHDRAW");
        expect(responseBody).to.have.property("amount", 2000.0);
        expect(responseBody).to.have.property("password", null);

        console.log(`/withdraw: withdraw transaction passed successfully`);
        cy.log(`/withdraw: withdraw transaction passed successfully`);
    });

    cy.wait(3000);

    // Step 11: POST /transferFund/{recipientContact}
        console.log("Hitting /transferFund API");
        cy.log("Hitting /transferFund API");

        const payerContact = contact;
        const payerPassword = password;
        const transferAmount = 500.00;
        const recipientContact = 6087654321;

        const requestBody_transfer = {
            contact: payerContact,     // Payer
            password: payerPassword,
            amount: transferAmount
        };

        cy.request({
                method: "POST",
                url: `${Cypress.config().baseUrl}/transferFund/${recipientContact}`,
                body: requestBody_transfer
            }).then((response) => {

        expect(response.status).to.eq(200);
        const responseBody = response.body;

        expect(responseBody).to.have.property("id");
        expect(responseBody).to.have.property("contact", recipientContact); // recipient
        expect(responseBody).to.have.property("txntype", "TRANSFER_IN");
        expect(responseBody).to.have.property("amount", transferAmount);
        expect(responseBody).to.have.property("password", null);

        console.log(`/transferFund: fund transferred successfully`);
        cy.log(`/transferFund: fund transferred successfully`);
    });

    cy.wait(3000);

    // Step 12: GET /displayStatement/{contact}?password={password}
    console.log("Hitting /displayStatement API");
    cy.log("Hitting /displayStatement API");

    const Ajv = require("ajv");
    const ajv = new Ajv();

    // Define the JSON schema
    const transactionSchema = {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "Transaction Array Schema",
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
            required: [
            "id",
            "contact",
            "txntype",
            "amount",
            "balanceAfter",
            "txnTime",
            "password"
            ]
        }
    };

    cy.request({
            method: "GET",
            url: `${Cypress.config().baseUrl}/displayStatement/${contact}?password=${password}`
            }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an("array");

            const validate = ajv.compile(transactionSchema);
            const isValid = validate(response.body);

            if (!isValid) {
            console.error("Schema validation failed:", validate.errors);
            }

            expect(isValid, "Schema validation result").to.be.true;
            console.log(`/displayStatement: Schema validated successfully`);
            cy.log(`/displayStatement: Schema validated successfully`);
        });

  });

});

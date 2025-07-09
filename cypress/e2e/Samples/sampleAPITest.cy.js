/// <reference types = "Cypress" />

describe('get api sample test', () => {

    let accessToken = '22cdb9e35e49fcc99643f4cca87628c54b22cb84db00ef4fc8a1a878a20eb4f7';

  it('get users', () => {
    // it.only('get users', () => {

    cy.request({
      method: 'GET',
      url: 'https://gorest.co.in/public/v2/users',
      headers: {
        Authorization: "Bearer " + accessToken,
        Accept: 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

  });

  it('get users/7439956', () => {

    cy.request({
      method: 'GET',
      url: 'https://gorest.co.in/public/v2/users/7439956',
      headers: {
        Authorization: "Bearer " + accessToken,
        Accept: 'application/json'
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(7439956);
    });

  });

});

/// <reference types="cypress" />

describe('API E2E - Posts flow', () => {
  let token;
  let createdId;

  before(() => {
    cy.request('POST', '/__test__/reset');
    cy.request('/__test__/token?userId=e2e-user').then((res) => {
      token = res.body.token;
    });
  });

  it('creates a post', () => {
    const body = {
      title: 'E2E Post',
      content: 'Created via Cypress',
      category: 'e2e-cat',
    };
    cy.request({
      method: 'POST',
      url: '/api/posts',
      headers: { Authorization: `Bearer ${token}` },
      body,
    }).then((res) => {
      expect(res.status).to.eq(201);
      createdId = res.body._id;
    });
  });

  it('lists posts and finds the created one', () => {
    cy.request('/api/posts').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.some((p) => p._id === createdId)).to.be.true;
    });
  });

  it('fetches a post by id', () => {
    cy.request(`/api/posts/${createdId}`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body._id).to.eq(createdId);
    });
  });

  it('updates a post', () => {
    cy.request({
      method: 'PUT',
      url: `/api/posts/${createdId}`,
      headers: { Authorization: `Bearer ${token}` },
      body: { title: 'E2E Post Updated' },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.title).to.eq('E2E Post Updated');
    });
  });

  it('deletes a post', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/posts/${createdId}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });
});

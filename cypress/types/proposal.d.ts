import {
  CreateProposalMutationVariables,
  UpdateProposalMutationVariables,
  AdministrationProposalMutationVariables,
  ChangeProposalsStatusMutation,
  UpdateProposalMutation,
  AdministrationProposalMutation,
  CreateProposalMutation,
  ChangeProposalsStatusMutationVariables,
} from '../../src/generated/sdk';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Creates new proposal with title and abstract passed. If nothing is passed it generates title and abstract on its own. You need to be logged in as a user.
       *
       * @returns {typeof createProposal}
       * @memberof Chainable
       * @example
       *    cy.createProposal(createProposalInput: CreateProposalMutationVariables)
       */
      createProposal: (
        createProposalInput: CreateProposalMutationVariables
      ) => Cypress.Chainable<CreateProposalMutation>;

      /**
       * Updates proposal
       *
       * @returns {typeof updateProposal}
       * @memberof Chainable
       * @example
       *    cy.updateProposal(updateProposalInput: UpdateProposalMutationVariables)
       */
      updateProposal: (
        updateProposalInput: UpdateProposalMutationVariables
      ) => Cypress.Chainable<UpdateProposalMutation>;

      /**
       * Change of the proposal status by name with status name passed as second parameter.
       * If no proposalTitle is passed it selects all proposals.
       *
       * @returns {typeof changeProposalStatus}
       * @memberof Chainable
       * @example
       *    cy.changeProposalStatus(changeProposalStatusInput: ChangeProposalsStatusInput)
       */
      changeProposalsStatus: (
        changeProposalStatusInput: ChangeProposalsStatusMutationVariables
      ) => Cypress.Chainable<ChangeProposalsStatusMutation>;

      /**
       * Allocates time for the proposal and optionally submits
       * management decision
       *
       * @returns {typeof updateProposalManagementDecision}
       * @memberof Chainable
       * @example
       *        cy.updateProposalManagementDecision(administrationProposalInput: AdministrationProposalMutationVariables);
       */
      updateProposalManagementDecision: (
        administrationProposalInput: AdministrationProposalMutationVariables
      ) => Cypress.Chainable<AdministrationProposalMutation>;
    }
  }
}

export {};

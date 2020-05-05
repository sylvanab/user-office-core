// NOTE: When creating new event we need to follow the same name standardization/convention: [WHERE]_[WHAT]
export enum Event {
  PROPOSAL_CREATED = 'PROPOSAL_CREATED',
  PROPOSAL_UPDATED = 'PROPOSAL_UPDATED',
  PROPOSAL_SUBMITTED = 'PROPOSAL_SUBMITTED',
  PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
  PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',

  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_PASSWORD_RESET_EMAIL = 'USER_PASSWORD_RESET_EMAIL',

  EMAIL_INVITE = 'EMAIL_INVITE',

  SEP_CREATED = 'SEP_CREATED',
  SEP_UPDATED = 'SEP_UPDATED',
  SEP_MEMBERS_ASSIGNED = 'SEP_MEMBERS_ASSIGNED',
  SEP_MEMBER_REMOVED = 'SEP_MEMBER_REMOVED',
  SEP_PROPOSAL_ASSIGNED = 'SEP_PROPOSAL_ASSIGNED',
  SEP_PROPOSAL_REMOVED = 'SEP_PROPOSAL_REMOVED',
}

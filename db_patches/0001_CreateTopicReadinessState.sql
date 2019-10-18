/*
author: 
    jekabskarklins
purpose: 
    Adding new table for keeping 
    track which steps have been finished when 
    submitting proposal
date:
    17.oct.2019
Jira:
    SWAP-274
*/

CREATE TABLE IF NOT EXISTS proposal_topic_completenesses(
  proposal_id INT NOT NULL REFERENCES proposals(proposal_id)
, topic_id INT NOT NULL REFERENCES proposal_topics(topic_id)
, is_complete BOOLEAN NOT NULL DEFAULT FALSE
, PRIMARY KEY (proposal_id, topic_id)
)

CREATE 
    INDEX UX_proposal_topic_completenesses_proposal_id  
ON 
    proposal_topic_completenesses(proposal_id) 
import baseContext from '../../buildContext';
import { questionaryDataSource } from '../../datasources';
import { Proposal } from '../../models/Proposal';
import {
  areDependenciesSatisfied,
  getQuestionaryStepByTopicId,
} from '../../models/ProposalModelFunctions';
import { Answer, QuestionaryStep } from '../../models/Questionary';
import { TechnicalReview } from '../../models/TechnicalReview';
import { DataType } from '../../models/Template';
import { BasicUserDetails, UserWithRole } from '../../models/User';
import { isRejection } from '../../rejection';
import { getFileAttachmentIds } from '../util';
import { collectSamplePDFData, SamplePDFData } from './sample';

type ProposalPDFData = {
  proposal: Proposal;
  principalInvestigator: BasicUserDetails;
  coProposers: BasicUserDetails[];
  questionarySteps: QuestionaryStep[];
  attachmentIds: string[];
  technicalReview?: TechnicalReview;
  samples: Array<Pick<SamplePDFData, 'sample' | 'sampleQuestionaryFields'>>;
};

const getTopicActiveAnswers = (
  questionarySteps: QuestionaryStep[],
  topicId: number
) => {
  const step = getQuestionaryStepByTopicId(questionarySteps, topicId);

  return step
    ? (step.fields.filter(field => {
        return areDependenciesSatisfied(
          questionarySteps,
          field.question.proposalQuestionId
        );
      }) as Answer[])
    : [];
};

export const collectProposalPDFData = async (
  proposalId: number,
  user: UserWithRole,
  notify?: CallableFunction
): Promise<ProposalPDFData> => {
  const userAuthorization = baseContext.userAuthorization;
  const proposal = await baseContext.queries.proposal.get(user, proposalId);

  // Authenticate user
  if (!proposal || !userAuthorization.hasAccessRights(user, proposal)) {
    throw new Error('User was not allowed to download PDF');
  }

  const queries = baseContext.queries.questionary;

  const questionarySteps = await queries.getQuestionarySteps(
    user,
    proposal.questionaryId
  );

  if (isRejection(questionarySteps) || questionarySteps == null) {
    throw new Error('Could not fetch questionary');
  }

  const principalInvestigator = await baseContext.queries.user.getBasic(
    user,
    proposal.proposerId
  );
  const coProposers = await baseContext.queries.user.getProposers(
    user,
    proposalId
  );

  if (!principalInvestigator || !coProposers) {
    throw new Error('User was not PI or co-proposer');
  }

  const sampleAttachmentIds: string[] = [];

  const samples = await baseContext.queries.sample.getSamples(user, {
    filter: { proposalId },
  });

  const samplePDFData = (
    await Promise.all(
      samples.map(sample => collectSamplePDFData(sample.id, user))
    )
  ).map(({ sample, sampleQuestionaryFields, attachmentIds }) => {
    sampleAttachmentIds.push(...attachmentIds);

    return { sample, sampleQuestionaryFields };
  });

  notify?.(
    `${proposal.created.getUTCFullYear()}_${principalInvestigator.lastname}_${
      proposal.shortCode
    }.pdf`
  );

  const out: ProposalPDFData = {
    proposal,
    principalInvestigator,
    coProposers,
    questionarySteps: [],
    attachmentIds: [],
    samples: samplePDFData,
  };

  // Information from each topic in proposal
  for (const step of questionarySteps) {
    if (!step) {
      console.error('step not found', questionarySteps);

      throw 'Could not download generated PDF';
    }

    const topic = step.topic;
    const answers = getTopicActiveAnswers(questionarySteps, topic.id).filter(
      // skip `PROPOSAL_BASIS` types
      answer => answer.question.dataType !== DataType.PROPOSAL_BASIS
    );

    // if the questionary step has nothing else but `PROPOSAL_BASIS` question
    // skip the whole step because the first page already has every related information
    if (answers.length === 0) {
      continue;
    }

    const questionaryAttachmentIds = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];

      questionaryAttachmentIds.push(...getFileAttachmentIds(answer));

      if (answer.question.dataType === DataType.SAMPLE_DECLARATION) {
        answer.value = samples
          .filter(
            sample => sample.questionId === answer.question.proposalQuestionId
          )
          .map(sample => sample);
      }
    }

    out.questionarySteps.push({
      ...step,
      fields: answers,
    });
    out.attachmentIds.push(...questionaryAttachmentIds);
    out.attachmentIds.push(...sampleAttachmentIds);
  }

  if (userAuthorization.isReviewerOfProposal(user, proposal.id)) {
    const technicalReview = await baseContext.queries.review.technicalReviewForProposal(
      user,
      proposal.id
    );
    if (technicalReview) {
      out.technicalReview = technicalReview;
    }
  }

  return out;
};

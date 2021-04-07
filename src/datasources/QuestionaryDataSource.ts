import {
  AnswerBasic,
  Questionary,
  QuestionaryStep,
} from '../models/Questionary';

export interface QuestionaryDataSource {
  getCount(templateId: number): Promise<number>;
  getAnswer(answer_id: number): Promise<AnswerBasic>;
  delete(questionary_id: number): Promise<Questionary>;
  getQuestionary(questionary_id: number): Promise<Questionary | null>;
  getQuestionarySteps(questionaryId: number): Promise<QuestionaryStep[]>;
  getBlankQuestionarySteps(templateId: number): Promise<QuestionaryStep[]>;
  updateAnswer(
    questionary_id: number,
    question_id: string,
    answer: string
  ): Promise<string>;
  deleteAnswers(questionary_id: number, question_ids: string[]): Promise<void>;
  updateTopicCompleteness(
    questionary_id: number,
    topic_id: number,
    isComplete: boolean
  ): Promise<void>;
  create(creator_id: number, template_id: number): Promise<Questionary>;
  clone(questionaryId: number): Promise<Questionary>;
}

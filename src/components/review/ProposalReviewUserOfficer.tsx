import Container from "@material-ui/core/Container";
import React, { useState } from "react";
import { useProposalData } from "../../hooks/useProposalData";
import ProposalTechnicalReview from "./ProposalTechnicalReview";
import ProposalQuestionaryReview from "./ProposalQuestionaryReview";
import SimpleTabs from "../common/TabPanel";
import { TechnicalReview } from "../../generated/sdk";

export default function ProposalReview({ match }: { match: any }) {
  // const [modalOpen, setOpen] = useState(false);
  // const [reviewers, setReviewers] = useState<any>([]);
  const [techReview, setTechReview] = useState<
    TechnicalReview | null | undefined
  >(null);
  const { proposalData } = useProposalData(parseInt(match.params.id));


  // To be added for reviews
  // const api = useDataApi();

  // useEffect(() => {
  //   if (proposalData) {
  //     setReviewers(
  //       proposalData.reviews!.map((review: any) => {
  //         const { firstname, lastname, id, username } = review.reviewer;
  //         return {
  //           firstname,
  //           lastname,
  //           username,
  //           id,
  //           reviewID: review.id
  //         };
  //       })
  //     );
  //     setTechReview(proposalData.technicalReview);
  //   }
  // }, [proposalData]);



  // const addUser = async (user: any) => {
  //   await api().addUserForReview({
  //     userID: user.id,
  //     proposalID: parseInt(match.params.id)
  //   });
  //   setReviewers([...reviewers, user]);
  //   setOpen(false);
  // };

  // const removeUser = async (user: any) => {
  //   let newUsers = [...reviewers];
  //   newUsers.splice(newUsers.indexOf(user), 1);

  //   setReviewers(newUsers);
  //   await api().removeUserForReview({
  //     reviewID: user.reviewID
  //   });
  // };

  if (!proposalData) {
    return <p>Loading</p>;
  }
  return (
    <Container maxWidth="lg">
      <SimpleTabs
        tabNames={["General", "Technical"]}
      >
        <ProposalQuestionaryReview data={proposalData} />
        <ProposalTechnicalReview
          id={proposalData.id}
          data={techReview}
          setReview={setTechReview}
        />
      </SimpleTabs>
    </Container>
  );
}

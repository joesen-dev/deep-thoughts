import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import ReactionForm from "../components/ReactionForm";
import { QUERY_THOUGHT } from "../utils/queries";
import Auth from "../utils/auth";

import ReactionList from "../components/ReactionList";

const SingleThought = props => {
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // The useQuery Hook is given a second argument in the form of an object.
    // This is how you can pass variables to queries that need them
    // The id property on the variables object will become the $id parameter in the GraphQL query.
    variables: { id: thoughtId },
  });

  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{" "}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {/* thought.reactionCount > 0 expression prevents rendering the reactions if the array is empty. */}
      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
  );
};

export default SingleThought;

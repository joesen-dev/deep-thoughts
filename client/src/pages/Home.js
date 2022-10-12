import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHTS } from "../utils/queries";
import ThoughtList from "../components/ThoughtList";

const Home = () => {
  // use useQuery hook to make query request
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  // The optional chaining operator (?.) accesses an object's property or calls a function. If the object is undefined or null, it returns undefined instead of throwing an error.
  // the following is saying is, if data exists, store it in the thoughts constant we just created
  // If data is undefined, then save an empty array to the thoughts component
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {/* If the query hasn't completed and loading is still defined, we display a message to indicate just that */}
          {/* Once the query is complete and loading is undefined, we pass the thoughts array and a custom title to the <ThoughtList> component as props */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;

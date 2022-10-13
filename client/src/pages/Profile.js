import React from "react";
import { Navigate, useParams } from "react-router-dom";

import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";

import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import Auth from "../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();

  // if there's a value in userParam that we got from the URL bar, we'll use that value to run the QUERY_USER query
  // If there's no value in userParam, like if we simply visit /profile as a logged-in user, we'll execute the QUERY_ME query instead
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  // navigate to personal profile page if username is the logged-in user's
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links
        above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* if userParam doesn't exist, we'll get a message saying "Viewing your profile." */}
          {/* Otherwise, it will display the username of the other user on their profile */}
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${user.username}'s thoughts...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

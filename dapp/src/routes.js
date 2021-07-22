import { Switch, Route, Redirect } from "react-router-dom";
import VoteKeyGeneratorForm from "./components/VoteKeyGeneratorForm";
import Results from "./components/results";
import SubmitVoteForm from "./components/submitVote";
import App from './App';
export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/generateVoteKey" exact>
          <VoteKeyGeneratorForm />
        </Route>
        <Route path="/submitVote" exact>
          <SubmitVoteForm />
        </Route>
        <Route path="/results" exact>
          <Results />
        </Route>
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path={"/"} exact>
        <App />
      </Route>
      <Redirect path={"/"} />
    </Switch>
  );
};
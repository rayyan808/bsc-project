import { Switch, Route, Redirect } from "react-router-dom";
import VoteKeyGeneratorForm from "./components/VoteKeyGeneratorForm";
import App from './App';
export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/generateVoteKey" exact>
          <VoteKeyGeneratorForm />
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
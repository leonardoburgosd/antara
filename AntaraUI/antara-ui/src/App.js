import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from "./components/login";
import ErrorPage from './pages/private-configuration/error-page';
import PrivateRoute from './pages/private-configuration/PrivateRoute';
import Dashboard from './components/dashboard';
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
}


export default App;

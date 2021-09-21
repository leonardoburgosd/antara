import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/login";
import Registro from "./components/registro/Registro";
import ErrorPage from "./pages/private-configuration/error-page";
import PrivateRoute from "./pages/private-configuration/PrivateRoute";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/" component={Home} /> */}
        <Route exact path="/registrarte" component={Registro} />
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

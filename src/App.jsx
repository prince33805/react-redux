import { useRoutes } from "react-router-dom";
import Posts from "./pages/Posts";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const App = () => {

  const element = useRoutes([
    { path:'/',element:<Posts/>},
    { path:'/signup',element:<SignUp/>},
    { path:'/login',element:<Login/>},
  ])

  return element
}

export default App


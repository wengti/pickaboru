import { RouterProvider, createBrowserRouter } from 'react-router'
import OuterLayout from './Layout/OuterLayout'
import NotFound from './Utils/NotFound'
import Home from './Content/Home'
import About from './Content/About'
import Paddles from './Content/Paddles'
import PaddleDetail from './Content/PaddleDetail'
import Signin from './Auth/Signin'
import Signup from './Auth/Signup'
import Error from "./Utils/Error"
import UserLayout from './Layout/UserLayout'
import Dashboard from './User/Dashboard'
import AddPaddle from './User/AddPaddle'

function App() {

    const routes = [
        {
            path: "/",
            Component: OuterLayout,
            children: [
                { index: true, Component: Home },
                { path: "about", Component: About },
                { path: "paddles", Component: Paddles },
                { path: "paddles/:id", Component: PaddleDetail },
                { path: "signin", Component: Signin },
                { path: "signup", Component: Signup },
                { path: "error", Component: Error },
                {
                    path: "user", Component: UserLayout, children:[
                        { index: true, Component: Dashboard},
                        { path: "add", Component: AddPaddle}
                    ]
                },
                { path: "*", Component: NotFound }
            ]
        },


    ]

    const router = createBrowserRouter(routes)

    return (
        <RouterProvider router={router} />
    )
}

export default App

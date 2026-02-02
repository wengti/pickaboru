import { RouterProvider, createBrowserRouter } from 'react-router'
import OuterLayout from './Layout/OuterLayout'
import NotFound from './Utils/NotFound'
import Home from './Content/Home'
import About from './Content/About'
import Paddles from './Content/Paddles'
import PaddleDetail from './Content/PaddleDetail'


function App() {

    const routes = [{
        path: "/",
        Component: OuterLayout,
        children: [
            {index: true, Component: Home},
            {path: "about", Component: About},
            {path: "paddles", Component: Paddles},
            {path: "paddles/:id", Component: PaddleDetail},
            {path: "*", Component: NotFound}
        ]
    }]

    const router = createBrowserRouter(routes)

    return (
        <RouterProvider router={router}/>
    )
}

export default App

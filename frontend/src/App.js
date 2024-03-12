import './App.css';
import Welcome from './pages/Welcome';
import Join from './pages/Join';
import Create from './pages/Create';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>
  },
  {
    path: "/create",
    element: <Create/>
  },
  {
    path: "/join",
    element: <Join/>
  }
])

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;

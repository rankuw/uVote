import './App.css';
import Welcome from './pages/Welcome';
import Join from './pages/Join';
import Create from './pages/Create';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import appStore from './store/appStore';

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
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
    </Provider>
    
  );
}

export default App;

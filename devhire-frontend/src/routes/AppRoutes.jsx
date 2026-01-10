// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import Signup from '../pages/Signup';

// function AppRoutes() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {AuthProvider} from '../context/AuthContext';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

function AppRoutes() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default AppRoutes;


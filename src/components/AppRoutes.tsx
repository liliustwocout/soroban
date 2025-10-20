import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.tsx";
import { NotFoundPage } from "@/pages/Share/NotFoundPage.tsx";
import CandidateList from "./CandidateList.tsx";
import VoteForm from "./Forms/VoteForm.tsx";
import ElectionResults from "./ElectionResults.tsx";
import RegisterCandidateForm from "./Forms/RegisterCandidateForm.tsx";
import Login from "./Login.tsx";
import Home from "./Home.tsx";
import AdminDashboard from "./Admin/AdminDashboard.tsx";
import AdminVotesViewer from "./Admin/AdminVotesViewer.tsx";
import AdminCandidateRegistration from "./Admin/AdminCandidateRegistration.tsx";
import { useAppContext } from "@/context/appContext";

const AppRoutes = () => {
  const { userType } = useAppContext();

  if (!userType) {
    return <Login />;
  }

  if (userType === 'admin') {
    const adminRoutes = [
      { element: <AdminDashboard />, path: "/" },
      { element: <AdminDashboard />, path: "/home" },
      { element: <AdminVotesViewer />, path: "/votes" },
      { element: <AdminCandidateRegistration />, path: "/register-candidate" },
      { element: <NotFoundPage />, path: "/*" },
    ];

    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {adminRoutes?.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>
      </Routes>
    );
  }

  const userRoutes = [
    { element: <Home />, path: "/" },
    { element: <Home />, path: "/home" },
    { element: <VoteForm />, path: "/vote" },
    { element: <ElectionResults />, path: "/results" },
    { element: <NotFoundPage />, path: "/*" },
  ];

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {userRoutes?.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

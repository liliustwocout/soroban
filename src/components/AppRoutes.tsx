import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { NotFoundPage } from "@/pages/Share/NotFoundPage";
import VoteForm from "./Forms/VoteForm";
import ElectionResults from "./ElectionResults";
import Login from "./Login";
import Home from "./Home";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminVotesViewer from "./Admin/AdminVotesViewer";
import AdminCandidateRegistration from "./Admin/AdminCandidateRegistration";
import { useAppContext } from "@/context/appContext";

const AppRoutes = () => {
  const { userType } = useAppContext();

  if (!userType) {
    return <Login />;
  }

  if (userType === "admin") {
    const adminRoutes = [
      { element: <AdminDashboard />, path: "/" },
      { element: <AdminDashboard />, path: "/home" },
      { element: <AdminVotesViewer />, path: "/votes" },
      { element: <AdminCandidateRegistration />, path: "/registerCandidate" },
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
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout.tsx";
import { NotFoundPage } from "@/pages/Share/NotFoundPage.tsx";
import CandidateList from "./CandidateList.tsx";
import VoteForm from "./Forms/VoteForm.tsx";
import ElectionResults from "./ElectionResults.tsx";
import RegisterCandidateForm from "./Forms/RegisterCandidateForm.tsx";

const routes = [
  { element: <CandidateList />, path: "/" },
  { element: <CandidateList />, path: "/home" },
  { element: <VoteForm />, path: "/vote" },
  { element: <ElectionResults />, path: "/results" },
  { element: <RegisterCandidateForm />, path: "/register" },
  { element: <NotFoundPage />, path: "/*" },
];

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes?.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

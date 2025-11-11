import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useAuth,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import Home from "./views/Home";
import AdminLogin from "./views/AdminLogin";
import Issue from "./views/Issue";
import Retrieve from "./views/Retrieve";
import CertificateTemplate from "./views/CertificateTemplate";
import Certificates from "./views/Certificates";
import UserLogin from "./views/UserLogin";
import UserCertificates from "./views/UserCertificates";
import { getCount, getMetaData, getOwnerOf } from "./SmartContract";
import axios from "axios";
import { certificateActions } from "./store/certificate-slice";

/* -----------------------------------------
   Loader while Clerk initializes
------------------------------------------ */
const Loader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0a0a",
      color: "white",
      fontSize: "1.2rem",
      flexDirection: "column",
    }}
  >
    <div className="loader mb-4 animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-12 h-12"></div>
    <p>Loading your session...</p>
  </div>
);

/* -----------------------------------------
   Role helper
------------------------------------------ */
const getStoredRole = () =>
  typeof window !== "undefined"
    ? window.sessionStorage.getItem("authRole")
    : null;

/* -----------------------------------------
   ProtectedRoute: prevents unauthorized access
------------------------------------------ */
const ProtectedRoute = ({ allowedRole, redirectTo }) => {
  const role = getStoredRole();
  if (!role) return <Navigate to={redirectTo} replace />;
  if (role !== allowedRole)
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  return <Outlet />;
};

/* -----------------------------------------
   App component
------------------------------------------ */
const App = () => {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const count = await getCount();
        const organizations = new Set();

        for (let tokenId = 1; tokenId <= count; tokenId++) {
          try {
            const result = await getMetaData(tokenId);
            const [jsonCID, CertificateCID] = result.split(",");
            if (!jsonCID) continue;

            const [response, ownerAddress] = await Promise.all([
              axios.get(`https://ipfs.io/ipfs/${jsonCID}`),
              getOwnerOf(tokenId),
            ]);

            const metadataWithOwner = {
              ...response.data,
              walletAddress: ownerAddress?.toLowerCase(),
            };

            dispatch(
              certificateActions.addCertificate({
                CertificateCID,
                metadata: metadataWithOwner,
                id: tokenId,
              })
            );

            if (metadataWithOwner.organization)
              organizations.add(metadataWithOwner.organization);
          } catch (err) {
            console.error(`Failed to fetch metadata for token ${tokenId}`, err);
          }
        }

        dispatch(certificateActions.setOrganizations([...organizations]));
      } catch (error) {
        console.error("Unable to load certificates from chain", error);
      }
    };

    loadCertificates();
  }, [dispatch]);

  if (!isLoaded) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* --- Admin routes --- */}
        <Route
          path="/admin"
          element={
            isSignedIn ? (
              <ProtectedRoute allowedRole="admin" redirectTo="/sign-in" />
            ) : (
              <RedirectToSignIn />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="issue-certificate" element={<Issue />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="retrieve-certificate" element={<Retrieve />} />
          <Route path="editCerti" element={<CertificateTemplate />} />
        </Route>

        {/* --- User routes --- */}
        <Route
          path="/user"
          element={
            isSignedIn ? (
              <ProtectedRoute allowedRole="user" redirectTo="/user-sign-in" />
            ) : (
              <RedirectToSignIn />
            )
          }
        >
          <Route index element={<UserCertificates />} />
        </Route>

        {/* --- Public routes --- */}
        <Route
          path="/sign-in"
          element={
            isSignedIn ? <Navigate to="/admin" replace /> : <AdminLogin />
          }
        />
        <Route
          path="/user-sign-in"
          element={isSignedIn ? <Navigate to="/user" replace /> : <UserLogin />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

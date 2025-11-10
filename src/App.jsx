import React, { useEffect } from "react";
import {
    BrowserRouter,
    Route,
    Routes,
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Home from "./views/Home";
import AdminLogin from "./views/AdminLogin";
import Issue from "./views/Issue";
import Retrieve from "./views/Retrieve";
import CertificateTemplate from "./views/CertificateTemplate";
import Certificates from "./views/Certificates";
import { getCount, getMetaData, getOwnerOf } from "./SmartContract";
import axios from "axios";
import { certificateActions } from "./store/certificate-slice";
import UserLogin from "./views/UserLogin";
import UserCertificates from "./views/UserCertificates";

const getStoredRole = () =>
    typeof window !== "undefined" ? window.sessionStorage.getItem("authRole") : null;

const ProtectedRoute = ({ allowedRole, redirectTo }) => {
    const location = useLocation();
    const role = getStoredRole();
    const isAuthorized = role === allowedRole;

    return (
        <>
            <SignedIn>
                {isAuthorized ? (
                    <Outlet />
                ) : (
                    <Navigate to={redirectTo} replace state={{ from: location }} />
                )}
            </SignedIn>
            <SignedOut>
                <Navigate to={redirectTo} replace state={{ from: location }} />
            </SignedOut>
        </>
    );
};

const AuthRoute = () => {
    const role = getStoredRole();
    const destination = role === "user" ? "/user" : "/admin";

    return (
        <>
            <SignedOut>
                <AdminLogin />
            </SignedOut>
            <SignedIn>
                <Navigate to={destination} replace />
            </SignedIn>
        </>
    );
};

const UserAuthRoute = () => {
    const role = getStoredRole();
    const destination = role === "admin" ? "/admin" : "/user";

    return (
        <>
            <SignedOut>
                <UserLogin />
            </SignedOut>
            <SignedIn>
                <Navigate to={destination} replace />
            </SignedIn>
        </>
    );
};





const App = () => {
    const dispatch = useDispatch();
    const myFun = async () => {
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

                    if (metadataWithOwner.organization) {
                        organizations.add(metadataWithOwner.organization);
                    }
                } catch (tokenError) {
                    console.error(`Failed to fetch metadata for token ${tokenId}`, tokenError);
                }
            }

            dispatch(certificateActions.setOrganizations([...organizations]));
        } catch (error) {
            console.error("Unable to load certificates from chain", error);
        }
    };
    useEffect(() => {
        myFun();
    }, []);

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/admin" replace />} />
                    <Route path="/sign-in" element={<AuthRoute />} />
                    <Route path="/user-sign-in" element={<UserAuthRoute />} />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRole="admin" redirectTo="/sign-in" />
                        }>
                        <Route index element={<Home />} />
                        <Route path="issue-certificate" element={<Issue />} />
                        <Route path="certificates" element={<Certificates />} />
                        <Route path="retrieve-certificate" element={<Retrieve />} />
                        <Route path="editCerti" element={<CertificateTemplate />} />
                    </Route>
                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute allowedRole="user" redirectTo="/user-sign-in" />
                        }>
                        <Route index element={<UserCertificates />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;

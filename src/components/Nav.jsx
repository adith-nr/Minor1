import React from "react";
import { Link } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
} from "@clerk/clerk-react";

const getRole = () =>
    typeof window !== "undefined" ? window.sessionStorage.getItem("authRole") : null;

const Nav = ({ cmp }) => {
    const role = getRole();
    const isAdmin = role === "admin" || role === null;
    const logoutRedirect = isAdmin ? "/sign-in" : "/user-sign-in";

    return (
        <div className='flex justify-center h-12 items-center text-lg font-semibold gap-6 flex-wrap'>
            {isAdmin ? (
                <>
                    <Link
                        to={"/admin"}
                        className={`mx-4 hover:text-[#2104ae] hover:cursor-pointer ${
                            cmp === "home" ? "underline" : ""
                        }`}>
                        Home
                    </Link>
                    <Link
                        to={"/admin/issue-certificate"}
                        className={`mx-4 hover:text-[#2104ae] hover:cursor-pointer ${
                            cmp === "issue" ? "underline" : ""
                        }`}>
                        Issue Certificate
                    </Link>
                    <Link
                        to={"/admin/certificates"}
                        className={`mx-4 hover:text-[#2104ae] hover:cursor-pointer ${
                            cmp === "certificates" ? "underline" : ""
                        }`}>
                        Certificates
                    </Link>
                </>
            ) : (
                <Link
                    to={"/user"}
                    className={`mx-4 hover:text-[#2104ae] hover:cursor-pointer ${
                        cmp === "user-certificates" ? "underline" : ""
                    }`}>
                    My Certificates
                </Link>
            )}
            <SignedOut>
                <SignInButton mode='modal' redirectUrl='/admin'>
                    <button className='px-4 py-2 text-sm font-semibold text-white bg-[#2104ae] rounded hover:bg-[#160176]'>
                        Login
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <SignOutButton
                    redirectUrl={logoutRedirect}
                    signOutCallback={() => {
                        if (typeof window !== "undefined") {
                            window.sessionStorage.removeItem("authRole");
                        }
                    }}>
                    <button className='px-4 py-2 text-sm font-semibold text-[#2104ae] border border-[#2104ae] rounded hover:bg-[#2104ae]/10'>
                        Logout
                    </button>
                </SignOutButton>
            </SignedIn>
        </div>
    );
};

export default Nav;

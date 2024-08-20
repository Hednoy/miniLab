"use client";

import type { FC, PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/SideBar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "@/components/Layout/Footer";

import { Flowbite } from "flowbite-react";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children, isFooter = true }) {
    return (
      <>
        <Navbar />
        <div className="flex items-start">
          {/* <Sidebar /> */}
          <MainContent isFooter={isFooter}>{children}</MainContent>
        </div>
      </>
    );
  };

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <div className="m-4">
      {children}
      {isFooter && (
        <div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default NavbarSidebarLayout;

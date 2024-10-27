// src/components/Navbar.js

import React, { useState, useEffect } from "react";
import AuthSystem from "./AuthSystem"; // Import untuk komponen autentikasi
import CloseIcon from "@mui/icons-material/Close";
import { useSpring, animated } from "@react-spring/web";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { auth } from "../firebase"; // Pastikan Firebase dikonfigurasi dengan benar
import AdminManage from "./AdminManage"; // Import komponen AdminManage

const Fade = React.forwardRef(function Fade(props, ref) {
  const { children, in: open, onClick, onEnter, onExited, ownerState, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    config: { duration: open ? 200 : 50 },
    onStart: () => open && onEnter && onEnter(null, true),
    onRest: () => !open && onExited && onExited(null, true),
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminManageOpen, setIsAdminManageOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setIsMenuOpen(false); // Tutup menu navbar saat login/logout berhasil
      setIsLoginOpen(false); // Tutup modal login setelah login berhasil
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const toggleAdminManage = () => {
    setIsAdminManageOpen(!isAdminManageOpen);
    setIsMenuOpen(false); // Tutup menu navbar di mobile saat Admin Manage dibuka
  };

  return (
    <>
      {/* Mobile */}
      <div className="flex justify-between relative top-3 lg:hidden">
        <div className="w-10 h-10 rounded-full flex justify-center items-center" id="UserButton">
          <img src="/NavIcon.png" alt="" className="w-6 h-6" onClick={toggleMenu} />
        </div>
        <div className={`text-center text-white ${isMenuOpen ? "hidden" : ""}`}>
          <div className="text-[0.7rem]">Hi, visitor!</div>
          <div className="font-bold text-[1rem]">WELCOME</div>
        </div>

        <div
          className={`w-10 h-10 rounded-full flex justify-center items-center `}
          id="UserButton"
          onClick={openLoginModal}
        >
          <img src="/user.svg" alt="" />
        </div>

        {isMenuOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMenu}></div>
        )}

        <div
          className={`fixed top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          id="IsiNavbar"
        >
          <ul className="mt-8">
            <li className="mb-4">
              <a href="#" className="text-white opacity-80 text-lg font-bold">
                Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#Gallery" className="text-white opacity-80 text-lg font-bold">
                Gallery
              </a>
            </li>
            <li className="mb-4">
              <a href="#Tabs" className="text-white opacity-80 text-lg font-bold">
                Structure & Schedule
              </a>
            </li>
            {isLoggedIn && (
              <li className="mb-4">
                <a href="#" onClick={toggleAdminManage} className="text-white opacity-80 text-lg font-bold">
                  Admin Manage
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Desktop */}
      <div className="flex justify-between relative top-4 hidden lg:flex">
        <div>
          <img src="/LogoMAN.png" className="w-10 h-10" alt="" />
        </div>
        <ul className="mt-2 flex gap-5">
          <li className="mb-4">
            <a href="#" className="text-white opacity-80 text-[1rem] font-semibold">
              Home
            </a>
          </li>
          <li className="mb-4">
            <a href="#Gallery" className="text-white opacity-80 text-[1rem] font-semibold">
              Gallery
            </a>
          </li>
          <li>
            <a href="#Tabs" className="text-white opacity-80 text-[1rem] font-semibold">
              Structure & Schedule
            </a>
          </li>
          {isLoggedIn && (
            <li>
              <a href="#" onClick={toggleAdminManage} className="text-white opacity-80 text-[1rem] font-semibold">
                Admin Manage
              </a>
            </li>
          )}
        </ul>
        <div
          className={`w-10 h-10 rounded-full flex justify-center items-center `}
          id="UserButton"
          onClick={openLoginModal}
        >
          <img src="/user.svg" alt="" />
        </div>
      </div>

      {/* Modal Login */}
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={isLoginOpen}
        onClose={closeLoginModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isLoginOpen}>
          <Box
            className="modal-box"
            style={{
              position: "relative",
              background: "transparent",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Button
              onClick={closeLoginModal}
              style={{
                position: "absolute",
                top: "2%",
                right: "2%",
                color: "white",
                background: "transparent",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </Button>
            <AuthSystem />
          </Box>
        </Fade>
      </Modal>

      {/* Modal Admin Manage */}
      <AdminManage isOpen={isAdminManageOpen} onClose={toggleAdminManage} />
    </>
  );
};

export default Navbar;

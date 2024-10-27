import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase"; // Firebase configuration
import Swal from "sweetalert2"; // Import Swal

function AuthSystem() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login

  const handleClose = () => {
    const profilePage = document.querySelector('.profile-page');
    if (profilePage) {
      profilePage.style.display = 'none'; // Menyembunyikan profile page
    }
  };
  
  useEffect(() => {
    // Cek jika user sudah login
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fungsi login
  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Email dan Password harus diisi!",
        customClass: {
          container: "sweet-alert-container"
        }
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
        icon: "success",
        title: "Login berhasil!",
        text: "Anda berhasil login.",
        customClass: {
          container: "sweet-alert-container"
        }
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error.message);
      Swal.fire({
        icon: "error",
        title: "Login gagal!",
        text: "Email atau password salah.",
        customClass: {
          container: "sweet-alert-container"
        }
      });
    }
  };

  // Fungsi logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: "success",
        title: "Logout berhasil!",
        text: "Anda telah logout.",
        customClass: {
          container: "sweet-alert-container"
        }
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error.message);
      Swal.fire({
        icon: "error",
        title: "Logout gagal!",
        text: "Terjadi kesalahan saat logout.",
        customClass: {
          container: "sweet-alert-container"
        }
      });
    }
  };

  // Jika sudah login, tampilkan halaman profile
  if (isLoggedIn) {
    return (
      <div className="profile-container">
    <div className="profile-box">
        <h2 className="profile-title">You Are Logged In</h2>
        <button className="logout-button" onClick={handleLogout}>
            Logout
        </button>
    </div>
</div>

    

    );
  }

  // Jika belum login, tampilkan form login
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AuthSystem;

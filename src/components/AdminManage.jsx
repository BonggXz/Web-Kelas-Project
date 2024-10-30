// src/components/AdminManage.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Button
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";

const AdminManage = ({ isOpen, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [approvedImages, setApprovedImages] = useState([]);
  const [menfessMessages, setMenfessMessages] = useState([]);
  const [publicChatMessages, setPublicChatMessages] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSwipeChange = (index) => {
    setTabIndex(index);
  };

  const fetchImagesFromLocalStorage = () => {
    const storedImages = JSON.parse(localStorage.getItem("Galery/images")) || [];
    const storedApprovedImages = JSON.parse(localStorage.getItem("Galery/GambarAman")) || [];
    
    setImages(storedImages);
    setApprovedImages(storedApprovedImages);
  };

  const fetchMenfessMessages = async () => {
    const menfessCollectionRef = collection(db, "menfess");
    const querySnapshot = await getDocs(menfessCollectionRef);

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    messages.sort((a, b) => a.timestamp - b.timestamp);
    setMenfessMessages(messages);
  };

  const fetchPublicChatMessages = async () => {
    const publicChatCollectionRef = collection(db, "chats");
    const querySnapshot = await getDocs(publicChatCollectionRef);

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    messages.sort((a, b) => a.timestamp - b.timestamp);
    setPublicChatMessages(messages);
  };

  const moveToGambarAman = (index) => {
    const updatedImages = [...images];
    const [imageToApprove] = updatedImages.splice(index, 1);

    const updatedApprovedImages = [...approvedImages, imageToApprove];

    localStorage.setItem("Galery/images", JSON.stringify(updatedImages));
    localStorage.setItem("Galery/GambarAman", JSON.stringify(updatedApprovedImages));

    setImages(updatedImages);
    setApprovedImages(updatedApprovedImages);

    Swal.fire({
      title: 'Berhasil!',
      text: `Sukses Menambahkan gambar pada galeri.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const deleteImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);

    localStorage.setItem("Galery/images", JSON.stringify(updatedImages));
    setImages(updatedImages);

    Swal.fire({
      title: 'Berhasil!',
      text: `Gambar berhasil dihapus.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const deleteApprovedImage = (index) => {
    const updatedApprovedImages = [...approvedImages];
    updatedApprovedImages.splice(index, 1);

    localStorage.setItem("Galery/GambarAman", JSON.stringify(updatedApprovedImages));
    setApprovedImages(updatedApprovedImages);

    Swal.fire({
      title: 'Berhasil!',
      text: `Gambar aman berhasil dihapus.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  const deleteMenfess = async (id) => {
    const menfessDocRef = doc(db, "menfess", id);

    try {
      await deleteDoc(menfessDocRef);
      Swal.fire({
        title: 'Berhasil!',
        text: `Menfess telah dihapus.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      fetchMenfessMessages();
    } catch (error) {
      console.error("Error deleting menfess:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat menghapus menfess.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const deletePublicChatMessage = async (id) => {
    const publicChatDocRef = doc(db, "chats", id);

    try {
      await deleteDoc(publicChatDocRef);
      Swal.fire({
        title: 'Berhasil!',
        text: `Pesan public chat telah dihapus.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      fetchPublicChatMessages();
    } catch (error) {
      console.error("Error deleting public chat message:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat menghapus pesan public chat.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  useEffect(() => {
    fetchImagesFromLocalStorage();
    fetchMenfessMessages();
    fetchPublicChatMessages();
  }, []);

  return (
    isOpen && (
      <Box
        sx={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          padding: 3,
          borderRadius: 2,
          width: "80%",
          margin: "auto",
          color: "white",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
          TabIndicatorProps={{
            style: { backgroundColor: "white", height: 2 },
          }}
          sx={{
            "& .MuiTab-root": {
              color: "white",
              fontWeight: "bold",
              "&.Mui-selected": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            },
          }}
        >
          <Tab label="Manage Menfess" />
          <Tab label="Public Chat" />
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={handleSwipeChange}>
          {/* Tab Manage Menfess */}
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Menfess Management
            </Typography>
            <Typography>
              Note: Jika tidak ada pesan yang terkirim silahkan reload
            </Typography>
            <div className="h-[22rem]">
              {menfessMessages.map((msg) => (
                <div key={msg.id} className="flex justify-between items-center mt-2 border-b border-gray-600">
                  <div className="flex flex-col">
                    <span className="text-white font-bold">Dari: {msg.from}</span>
                    <span className="text-white font-bold">Kepada: {msg.to}</span>
                    <span className="text-gray-400">Tanggal: {new Date(msg.timestamp).toLocaleString()}</span>
                    <p className="text-white">Pesan: {msg.message}</p>
                  </div>
                  <div className="flex items-center">
                    <IconButton onClick={() => deleteMenfess(msg.id)} className="text-red-500 ml-2" title="Delete">
                      <CloseIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </Box>

          {/* Tab Public Chat */}
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Public Chat Management
            </Typography>
            <div className="h-[22rem]">
              {publicChatMessages.length > 0 ? (
                publicChatMessages.map((msg) => (
                  <div key={msg.id} className="flex justify-between items-center mt-2 border-b border-gray-600">
                    <div className="flex flex-col">
                      <span className="text-white">Pesan: {msg.message}</span>
                    </div>
                    <div className="flex items-center">
                      <IconButton onClick={() => deletePublicChatMessage(msg.id)} className="text-red-500 ml-2" title="Delete">
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <Typography color="gray">Tidak Ada Pesan Public Chat</Typography>
              )}
            </div>
          </Box>
        </SwipeableViews>
      </Box>
    )
  );
};

export default AdminManage;

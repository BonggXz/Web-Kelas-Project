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
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject
} from "firebase/storage";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

const AdminManage = ({ isOpen, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [menfessMessages, setMenfessMessages] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSwipeChange = (index) => {
    setTabIndex(index);
  };

  // Fungsi untuk mengambil daftar gambar dari Firebase Storage
  const fetchImagesFromFirebase = async () => {
		try {
			const storage = getStorage()
			const storageRef = ref(storage, "images/")

			const imagesList = await listAll(storageRef)

			const imagePromises = imagesList.items.map(async (item) => {
				const url = await getDownloadURL(item)
				const metadata = await getMetadata(item)

				return {
					url,
					timestamp: metadata.timeCreated,
				}
			})

			const imageURLs = await Promise.all(imagePromises)

			// Urutkan array berdasarkan timestamp (dari yang terlama)
			imageURLs.sort((a, b) => a.timestamp - b.timestamp)

			setImages(imageURLs)
		} catch (error) {
			console.error("Error fetching images from Firebase Storage:", error)
		}
	}
  // Fungsi untuk mengambil daftar menfess dari Firestore
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

  // Fungsi untuk menghapus menfess
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

  // Fungsi untuk memindahkan gambar ke folder GambarAman
  const moveImageToGambarAman = async (imageName) => {
    const currentPath = `images/${imageName}`;
    const destinationPath = `GambarAman/${imageName}`;

    try {
      console.log(`Moving image from ${currentPath} to ${destinationPath}`);
      await moveFirebaseFile(currentPath, destinationPath);
      Swal.fire({
        title: 'Berhasil!',
        text: `Gambar ${imageName} telah dipindahkan ke GambarAman.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      fetchImagesFromFirebase();
    } catch (error) {
      console.error("Error moving image:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat memindahkan gambar.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // Fungsi untuk memindahkan file di Firebase Storage
  const moveFirebaseFile = async (currentPath, destinationPath) => {
    const storage = getStorage();
    const oldRef = ref(storage, currentPath);

    try {
      const url = await getDownloadURL(oldRef);
      const response = await fetch(url);
      const blob = await response.blob();

      const newRef = ref(storage, destinationPath);
      await uploadBytes(newRef, blob);
      await deleteObject(oldRef);
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchImagesFromFirebase();
    fetchMenfessMessages();
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
          <Tab label="Manage Gallery" />
          <Tab label="Manage Menfess" />
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={handleSwipeChange}>
          {/* Tab Manage Gallery */}
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Gallery Management
            </Typography>
            <div className="h-[22rem] overflow-y-scroll">
              {images.length > 0 ? (
                images.map((imageData, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-5 py-2 mt-2"
                  >
                    <img
                      src={imageData.url}
                      alt={`Image ${index}`}
                      className="h-10 w-10"
                    />
                    <span className="ml-2 text-white">
                      {new Date(imageData.timestamp).toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <IconButton
                        onClick={() => moveImageToGambarAman(imageData.name)}
                        className="text-green-500 ml-2"
                        title="Acc"
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteObject(ref(getStorage(), `images/${imageData.name}`))}
                        className="text-red-500 ml-2"
                        title="Delete"
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                ))
              ) : (
                <Typography color="gray">Loading images...</Typography>
              )}
            </div>
          </Box>

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
                <div
                  key={msg.id}
                  className="flex justify-between items-center mt-2 border-b border-gray-600"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-bold">Dari: {msg.from}</span>
                    <span className="text-white font-bold">Kepada: {msg.to}</span>
                    <span className="text-gray-400">
                      Tanggal: {new Date(msg.timestamp).toLocaleString()}
                    </span>
                    <p className="text-white">Pesan: {msg.message}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        Swal.fire({
                          title: 'Apakah Anda yakin?',
                          text: "Anda akan menghapus menfess ini!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Ya, hapus!',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteMenfess(msg.id);
                          }
                        });
                      }}
                      className="text-red-500 ml-2"
                      title="Delete"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </SwipeableViews>
      </Box>
    )
  );
};

export default AdminManage;

import React, { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
const baseURL = process.env.REACT_APP_BASE_URL


const Profile = () => {
  const { user, getAuthHeader } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    college: "",
    photoURL: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching profile for user:", user.uid);
        
        // Set basic info from auth
        setProfileData(prev => ({
          ...prev,
          email: user.email || "",
          fullName: user.displayName || "",
          photoURL: user.photoURL || ""
        }));
        
        // Get additional info from Firestore via backend API
        const response = await axios.get(
          `${baseURL}/api/users/profile`, 
          getAuthHeader()
        );
        
        if (response.data) {
          const userData = response.data;
          console.log("User data found:", userData);
          
          setProfileData(prev => ({
            ...prev,
            fullName: userData.fullName || userData.name || prev.fullName,
            phoneNumber: userData.phoneNumber || "",
            college: userData.college || "",
            photoURL: userData.photoURL || prev.photoURL
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data: " + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, getAuthHeader]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setError(null);
    setSuccess(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (limit to 2MB for faster uploads)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB for faster uploads");
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Firebase Storage via backend
  const uploadImage = async () => {
    if (!imageFile || !user) return null;
    
    setUploading(true);
    setError(null);
    
    try {
      // Create form data to send the file
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      
      // Send the file to the backend
      const response = await axios.post(
        `${baseURL}/api/users/upload-profile-image`,
        formData,
        {
          ...getAuthHeader(),
          headers: {
            ...getAuthHeader().headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Image uploaded successfully, URL:", response.data.downloadURL);
      
      // Return both the URL and storage path
      return {
        downloadURL: response.data.downloadURL,
        storagePath: response.data.storagePath
      };
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(`Failed to upload image: ${err.response?.data?.message || err.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle save button click
  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      setUploading(true);
      
      // Upload image if a new one was selected
      let imageData = null;
      if (imageFile) {
        imageData = await uploadImage();
        if (!imageData) {
          // If image upload failed, stop the save process
          setUploading(false);
          return;
        }
      }
      
      // Prepare updated profile data
      const updatedData = {
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        college: profileData.college
      };
      
      // If we have a new image URL, add it to the updated data
      if (imageData && imageData.downloadURL) {
        updatedData.photoURL = imageData.downloadURL;
      }
      
      // Update profile in backend
      const response = await axios.put(
        `${baseURL}/api/users/profile`,
        updatedData,
        getAuthHeader()
      );
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updatedData
      }));
      
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(`Failed to save profile: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading profile...</div>;
  }
  
  if (!user) {
    return <div className="text-center p-10 text-red-500">You must be logged in to view your profile</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 mb-2">
          <img
            src={imagePreview || profileData.photoURL || "https://via.placeholder.com/150?text=Profile"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-gray-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/150?text=Profile";
            }}
          />
          
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
                disabled={uploading}
              />
            </label>
          )}
        </div>
        
        {uploading && <p className="text-sm text-blue-500">Uploading image...</p>}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profileData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white ${
              isEditing ? "border-blue-500" : "border-gray-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white ${
              isEditing ? "border-blue-500" : "border-gray-300"
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">College</label>
          <input
            type="text"
            name="college"
            value={profileData.college}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white ${
              isEditing ? "border-blue-500" : "border-gray-300"
            }`}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {isEditing ? (
          <>
            <button 
              onClick={() => {
                setIsEditing(false);
                setImageFile(null);
                setImagePreview(null);
                setError(null);
                setSuccess(null);
              }} 
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              disabled={uploading}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave} 
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Save'}
            </button>
          </>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;

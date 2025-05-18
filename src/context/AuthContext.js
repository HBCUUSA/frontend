import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Google client ID from environment variables
//for some reason if i use the environment variable it doesn't work, check it out able

const GOOGLE_CLIENT_ID  = process.env.REACT_APP_GOOGLE_CLIENT_ID 
const baseURL = process.env.REACT_APP_BASE_URL
console.log("baseURL", baseURL)

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleInitialized, setGoogleInitialized] = useState(false);

  // Check for existing token and user data on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (token && storedUser) {
          // Set the user from localStorage
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid with the backend
          try {
            const response = await axios.get(`${baseURL}/api/auth/verify`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            // If verification successful, update user data with latest from server
            if (response.data.valid) {
              setUser(response.data.user);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            // Don't clear token on network errors to allow offline usage
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Initialize Google API as soon as the component mounts
  useEffect(() => {
    // Handle the credential response from Google
    const handleCredentialResponse = async (response) => {
      if (response.credential) {
        try {
          const result = await processGoogleSignIn(response.credential);
          if (result.success) {
            window.location.href = '/programs';
          }
        } catch (error) {
          console.error("Error processing Google credential:", error);
        }
      }
    };

    const initializeGoogleAuth = () => {
      if (!window.google || googleInitialized) return;
      
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGoogleInitialized(true);
        console.log("Google Identity Services initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Google Identity Services:", error);
      }
    };

    // Load Google Identity Services script programmatically if not already loaded
    if (!window.google && !document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Identity Services script loaded");
        initializeGoogleAuth();
      };
      document.head.appendChild(script);
    } else if (window.google) {
      // Google API already available, initialize auth
      initializeGoogleAuth();
    }

    // Clean up function
    return () => {
      if (window.google && googleInitialized) {
        try {
          // Cancel any ongoing Google Identity Service operations on unmount
          window.google.accounts.id.cancel();
        } catch (e) {
          console.error("Error cleaning up Google Identity Services:", e);
        }
      }
    };
  }, [googleInitialized]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password
      });
      
      // Store token and user data
      const { token, user } = response.data;
      console.log("Login response:", response.data);
      
      // Make sure token is actually present
      if (!token) {
        console.error("No token received from server");
        return { 
          success: false, 
          message: "Authentication failed: No token received" 
        };
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint (optional)
      await axios.post(`${baseURL}/api/auth/logout`, {}, getAuthHeader());
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      
      // Sign out from Google
      if (window.google && googleInitialized) {
        try {
          window.google.accounts.id.disableAutoSelect();
        } catch (e) {
          console.error("Error signing out from Google:", e);
        }
      }
    }
  };

  // Get auth header for API requests
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No authentication token found");
    }
    
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    };
  };

  // Signup function
  const signup = async (email, password, displayName, college) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/signup`, {
        email,
        password,
        displayName,
        college
      });
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Signup failed" 
      };
    }
  };

  // Process Google sign in
  const processGoogleSignIn = async (credential) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/google`, {
        credential: credential
      });
      
      // Store token and user data
      const { token, user } = response.data;
      
      if (!token) {
        console.error("No token received from server");
        return { 
          success: false, 
          message: "Authentication failed: No token received" 
        };
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Google sign in failed" 
      };
    }
  };

  // Google Sign In function using Google Identity Services
  const signInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      if (!window.google) {
        console.error("Google Identity Services not loaded");
        // Try to load the script if it's not available
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Identity Services script loaded on demand");
          // Initialize and show sign-in once loaded
          initializeAndSignIn(resolve, reject);
        };
        script.onerror = () => {
          reject("Failed to load Google Identity Services script");
        };
        document.head.appendChild(script);
        return;
      }
      
      initializeAndSignIn(resolve, reject);
    });
  };

  // Helper function to initialize Google Auth and trigger sign-in
  const initializeAndSignIn = (resolve, reject) => {
    try {
      if (!googleInitialized) {
        // Initialize Google Identity Services with callback
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (response.credential) {
              try {
                const result = await processGoogleSignIn(response.credential);
                if (result.success) {
                  window.location.href = '/programs';
                  resolve(result);
                }
              } catch (error) {
                reject(error);
              }
            } else {
              reject("No credential received from Google");
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGoogleInitialized(true);
      }

      // Display the One Tap UI or button click
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google One Tap not displayed or skipped:", 
                      notification.isNotDisplayed() 
                        ? notification.getNotDisplayedReason() 
                        : notification.getSkippedReason());
          
          // Fall back to a manual button click
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            { theme: 'filled_blue', size: 'large' }
          );
          setTimeout(() => {
            // Try to find and click the Google button
            const googleBtn = document.querySelector('[aria-labelledby="button-label"]');
            if (googleBtn) {
              googleBtn.click();
              resolve({ success: true, message: "Google Sign In button clicked" });
            } else {
              reject("Could not display Google Sign In UI");
            }
          }, 100);
        } else {
          resolve({ success: true, message: "Google Sign In UI displayed" });
        }
      });
    } catch (error) {
      console.error("Error in Google Sign In:", error);
      reject(error);
    }
  };

  // Handle Google redirect callback - no longer needed with the new approach
  const handleGoogleCallback = async () => {
    // This function is no longer needed with the new approach,
    // but kept for compatibility with existing code
    console.log("Google callback handled by Google Identity Services directly");
    return true;
  };

  // Reset password function - simplified to use only backend API
  const resetPassword = async (email) => {
    if (!email || !email.trim()) {
      throw new Error("Email is required");
    }
    
    try {
      await axios.post(`${baseURL}/api/auth/reset-password`, { email });
      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      
      // Create an error with code similar to Firebase for consistency in error handling
      const customError = new Error(
        error.response?.data?.message || "Failed to send password reset email"
      );
      
      // Add code property to match expected format in Login.jsx error handler
      if (error.response?.status === 404) {
        customError.code = 'auth/user-not-found';
      } else if (error.response?.data?.code) {
        customError.code = error.response.data.code;
      } else if (error.response?.status === 400) {
        customError.code = 'auth/invalid-email';
      } else {
        customError.code = 'auth/unknown';
      }
      
      throw customError;
    }
  };

  // Send sign-in link (Magic Link) 
  const sendSignInLink = async (email, redirectUrl) => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/magic-link`, {
        email,
        redirectUrl
      });
      
      return { success: true };
    } catch (error) {
      console.error("Magic link error:", error);
      throw new Error(error.response?.data?.message || "Failed to send magic link");
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    getAuthHeader,
    signInWithGoogle,
    handleGoogleCallback,
    resetPassword,
    sendSignInLink
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
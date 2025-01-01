//auth states and functions to be used in different places in the app
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null, // initially, no user is authenticated
  isCheckingAuth: true, // therefore, the checking process is happening
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  // called whenever our app starts - make sure sockets are incorporated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // again, make sure to be connected to socket server
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signed Up Successfully");

      get().connectSocket(); // when signed in, connect to server to be online for message exchange
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");

      get().connectSocket(); // when logged in, connect to server to be online for message exchange
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket(); // when logged out, also disconnect from the socket
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfilePicture: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile-pic", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; //don't continue if user is not authenticated or is already connected

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // when connecting, pass the user's id to be used when storing onlineUsers
      },
    });
    socket.connect();

    set({ socket: socket });

    // listen for onlineUsers updates (via the getOnlineUsers event emitted from the socket.js)
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds }); // update the state to match the one captured from the backend on every connect/disconnect
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

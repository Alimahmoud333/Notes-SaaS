import { createContext, useContext, useReducer } from "react";

import API from "../api/axios";
import profileReducer from "../reducers/profileReducer";

export const ProfileContext = createContext(null);

export const ProfileDispatchContext = createContext(null);

export const useProfile = () => useContext(ProfileContext);

export const useProfileDispatch = () => useContext(ProfileDispatchContext);

export default function ProfileProvider({ children }) {
  const [profile, dispatch] = useReducer(profileReducer, null);

  const loadProfile = async () => {
    dispatch({ type: "get" });

    try {
      const res = await API.get("/profile");

      dispatch({
        type: "set",
        payload: res.data.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProfileContext.Provider value={profile}>
      <ProfileDispatchContext.Provider
        value={{
          dispatch,
          loadProfile,
        }}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

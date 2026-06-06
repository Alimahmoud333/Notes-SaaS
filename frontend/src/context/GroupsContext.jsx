import { createContext, useContext, useReducer } from "react";

import groupsReducer from "../reducers/groupsReducer";

export const GroupsContext = createContext([]);

export const GroupsDispatchContext = createContext(null);

export default function GroupsProvider({ children }) {
  const [groups, dispatch] = useReducer(groupsReducer, []);

  return (
    <GroupsContext.Provider value={groups}>
      <GroupsDispatchContext.Provider value={dispatch}>
        {children}
      </GroupsDispatchContext.Provider>
    </GroupsContext.Provider>
  );
}

export const useGroups = () => useContext(GroupsContext);

export const useGroupsDispatch = () => useContext(GroupsDispatchContext);

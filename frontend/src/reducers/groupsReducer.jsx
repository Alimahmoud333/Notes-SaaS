export default function groupsReducer(currentGroups, action) {
  switch (action.type) {
    case "set": {
      localStorage.setItem("groups", JSON.stringify(action.payload));

      return action.payload;
    }

    case "get": {
      const groups = JSON.parse(localStorage.getItem("groups")) || [];

      return groups;
    }

    case "added": {
      const updated = [action.payload, ...currentGroups];

      localStorage.setItem("groups", JSON.stringify(updated));

      return updated;
    }

    case "updated": {
      const updated = currentGroups.map((group) =>
        group.id === action.payload.id ? action.payload : group,
      );

      localStorage.setItem("groups", JSON.stringify(updated));

      return updated;
    }

    case "deleted": {
      const updated = currentGroups.filter(
        (group) => group.id !== action.payload,
      );

      localStorage.setItem("groups", JSON.stringify(updated));

      return updated;
    }

    default:
      throw Error("Unknown Action");
  }
}

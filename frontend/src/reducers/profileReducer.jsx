export default function profileReducer(profile, action) {
  switch (action.type) {
    case "get": {
      return JSON.parse(localStorage.getItem("profile")) || null;
    }

    case "set": {
      localStorage.setItem("profile", JSON.stringify(action.payload));

      return action.payload;
    }

    case "updated": {
      localStorage.setItem("profile", JSON.stringify(action.payload));

      return action.payload;
    }

    case "avatarUpdated": {
      const updated = {
        ...profile,
        avatar: action.payload.avatar,
      };

      localStorage.setItem("profile", JSON.stringify(updated));

      return updated;
    }

    case "logout": {
      localStorage.removeItem("profile");
      return null;
    }

    default:
      throw Error("Unknown action");
  }
}

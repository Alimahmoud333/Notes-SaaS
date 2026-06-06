import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useGroups, useGroupsDispatch } from "../../context/GroupsContext";
import GroupCard from "../../components/groups/GroupCard";
import CreateGroupModal from "../../components/groups/CreateGroupModal";
import UpdateGroupModal from "../../components/groups/UpdateGroupModal";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext"; 

export default function GroupsPage() {
  const groups = useGroups();
  const dispatch = useGroupsDispatch();
  const { showToast } = useToast();
  const { showModal } = useModal(); 

  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  useEffect(() => {
    dispatch({ type: "get" });
    loadGroups();
  }, []);

  async function loadGroups(page = 1) {
    try {
      const res = await API.get(`/groups?page=${page}`);
      dispatch({ type: "set", payload: res.data.data });
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function deleteGroup(group) {
    showModal({
      title: "Delete Group",
      message: `Are you sure you want to delete "${group.name}"?`,
      onConfirm: async () => {
        try {
          await API.delete(`/groups/${group.id}`);
          dispatch({ type: "deleted", payload: group.id });
          showToast("Group deleted successfully", "success");
        } catch (error) {
          showToast(error.response?.data?.message || "Delete failed", "danger");
        }
      },
    });
  }

  function openUpdate(group) {
    setSelectedGroup(group);
    setShowUpdate(true);
  }

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-between mb-4">
          <h2>Groups</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}>
            Create Group
          </button>
        </div>

        <input
          className="form-control mb-4"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" />
          </div>
        ) : (
          filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={deleteGroup}
              onEdit={openUpdate}
            />
          ))
        )}

        {/* Pagination */}
        <div className="mt-4 d-flex justify-content-center gap-2">
          {Array.from({ length: pagination.last_page }, (_, i) => (
            <button
              key={i}
              className={`btn ${
                pagination.current_page === i + 1
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => loadGroups(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
      {showUpdate && selectedGroup && (
        <UpdateGroupModal
          group={selectedGroup}
          onClose={() => {
            setShowUpdate(false);
            setSelectedGroup(null);
          }}
        />
      )}
    </>
  );
}

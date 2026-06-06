import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../api/axios";

import MemberCard from "../../components/groups/MemberCard";

import PermissionsModal from "../../components/groups/PermissionsModal";

import TransferOwnershipModal from "../../components/groups/TransferOwnershipModal";

import { useToast } from "../../context/ToastContext";

export default function GroupMembersPage() {
  const { id } = useParams();

  const { showToast } = useToast();

  const [members, setMembers] = useState([]);

  const [group, setGroup] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState(null);

  const [showPermissions, setShowPermissions] = useState(false);

  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const groupRes = await API.get(`/groups/${id}`);

      const membersRes = await API.get(`/groups/${id}/members`);

      setGroup(groupRes.data);

      setMembers(membersRes.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function removeMember(member) {
    if (!window.confirm(`Remove ${member.user.name}?`)) return;

    try {
      await API.delete(`/groups/${id}/members/${member.user_id}`);

      showToast("Member removed successfully", "success");

      loadData();
    } catch (error) {
      showToast(error.response?.data?.message, "danger");
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <h2 className="mb-4">Group Members</h2>

        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isOwner={true}
            onRemove={removeMember}
            onPermissions={(m) => {
              setSelectedMember(m);
              setShowPermissions(true);
            }}
            onTransfer={(m) => {
              setSelectedMember(m);
              setShowTransfer(true);
            }}
          />
        ))}
      </div>

      {showPermissions && selectedMember && (
        <PermissionsModal
          groupId={id}
          member={selectedMember}
          onClose={() => setShowPermissions(false)}
          reload={loadData}
        />
      )}

      {showTransfer && selectedMember && (
        <TransferOwnershipModal
          groupId={id}
          member={selectedMember}
          onClose={() => setShowTransfer(false)}
          reload={loadData}
        />
      )}
    </>
  );
}

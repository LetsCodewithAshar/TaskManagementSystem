import { useState } from "react";
import { FiUserX, FiUserPlus, FiShield, FiUser } from "react-icons/fi";

const MembersList = ({ members, isAdmin, onAddMember, onRemoveMember, ownerId }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await onAddMember(email);
      setEmail("");
    } catch (err) {
      // handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="members-section">
      <h3 className="section-title">
        Members ({members.length})
      </h3>

      {isAdmin && (
        <form className="add-member-form" onSubmit={handleAdd}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Add member by email"
            required
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            <FiUserPlus size={14} />
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      )}

      <ul className="members-list">
        {members.map((m) => (
          <li key={m.user._id} className="member-item">
            <div className="member-info">
              {m.role === "admin" ? (
                <FiShield size={14} className="role-icon admin" />
              ) : (
                <FiUser size={14} className="role-icon" />
              )}
              <span className="member-name">{m.user.name}</span>
              <span className="member-email">{m.user.email}</span>
              <span className={`role-tag ${m.role}`}>{m.role}</span>
            </div>
            {isAdmin && m.user._id !== ownerId && (
              <button
                className="btn-icon-sm"
                onClick={() => onRemoveMember(m.user._id)}
                title="Remove member"
              >
                <FiUserX size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersList;

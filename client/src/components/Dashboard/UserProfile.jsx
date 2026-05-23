import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiPencil, HiTrash } from "react-icons/hi";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";
import { getUserId } from "../../utils/normalizeUser";
import UserAvatar from "../ui/UserAvatar";
import Modal from "../ui/Modal";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const userId = getUserId(user);

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user?.username]);

  const handleUpdate = () => {
    dispatch(updateUser({ userId, username: newUsername }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(userId));
    setDeleteModalOpen(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">Settings</h1>
        <p className="text-[var(--secondary-text)] mt-1">Manage your account and preferences</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <UserAvatar user={user} size="xl" />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-color)]">{user.fullname}</h2>
            <p className="text-[var(--primary-text)] font-medium">@{user.username}</p>
            <p className="text-[var(--secondary-text)]">{user.email}</p>
            <p className="text-xs text-[var(--secondary-text)] font-mono pt-2 border-t border-[var(--border-color)]">
              ID: {user._id}
            </p>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <button type="button" onClick={() => setEditModalOpen(true)} className="btn-secondary justify-center py-3">
            <HiPencil className="text-lg" /> Edit username
          </button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-900 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <HiTrash className="text-lg" /> Delete account
          </button>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-[var(--text-color)] mb-4">Appearance</h3>
        <p className="text-sm text-[var(--secondary-text)]">
          Use the moon/sun icon in the top bar to switch between light and dark mode.
        </p>
      </div>

      {editModalOpen && (
        <Modal title="Update username" onClose={() => setEditModalOpen(false)} maxWidth="max-w-md">
          <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="input-field"
            placeholder="username"
          />
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleUpdate} className="btn-primary">
              Save changes
            </button>
          </div>
        </Modal>
      )}

      {deleteModalOpen && (
        <Modal title="Delete account?" onClose={() => setDeleteModalOpen(false)} maxWidth="max-w-md">
          <p className="text-[var(--secondary-text)] text-sm leading-relaxed">
            This will permanently delete your account and cannot be undone. Your uploaded files may remain on the server.
          </p>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setDeleteModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete permanently
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;

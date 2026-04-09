"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/app/components/StatsCard";
import DataTable from "@/app/components/DataTable";
import StatusBadge from "@/app/components/StatusBadge";
import Modal from "@/app/components/ui/Modal";
import FormField, { Input, Select } from "@/app/components/ui/FormField";
import Button from "@/app/components/ui/Button";
import Loader from "@/app/components/Loader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// SVG path constants
const ICON_USERS = "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75";
const ICON_CHECK = "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3";
const ICON_X = "M18 6L6 18M6 6l12 12";
const ICON_BAN = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM4.93 4.93l14.14 14.14";

interface UserData extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  country: string;
  status: string;
  points: number;
  bags: number;
  joinedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/users`);
      const json = await res.json();
      if (json.success) {
        const mapped = json.data.map((u: UserData) => ({
          ...u,
          joinedAt: new Date(u.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));
        setUsers(mapped);
      } else {
        setError(json.message || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
  const bannedUsers = users.filter((u) => u.status === "Banned").length;

  const handleView = (user: UserData) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  if (loading) {
    return <Loader text="Loading users..." fullPage />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 120px)" }}>
        <div className="text-center">
          <p className="text-sm text-[#EF4444]">{error}</p>
          <Button onClick={fetchUsers}>Retry</Button>
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row: UserData) => (
        <span className="font-medium text-white">{row.name}</span>
      ),
    },
    { key: "email", label: "Email" },
    { key: "country", label: "Country" },
    {
      key: "status",
      label: "Status",
      render: (row: UserData) => <StatusBadge status={row.status} />,
    },
    {
      key: "points",
      label: "Points",
      render: (row: UserData) => (
        <span className="font-medium text-white">{row.points.toLocaleString()}</span>
      ),
    },
    { key: "joinedAt", label: "Joined" },
  ];

  const actions = (row: UserData) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleView(row);
        }}
        className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        title="View"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg p-1.5 text-[#EF4444]/70 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
        title="Ban"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M4.93 4.93l14.14 14.14" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-4">
        <StatsCard title="Total Users" value={totalUsers} icon={ICON_USERS} />
        <StatsCard title="Active Users" value={activeUsers} icon={ICON_CHECK} />
        <StatsCard title="Inactive Users" value={inactiveUsers} icon={ICON_X} />
        <StatsCard title="Banned Users" value={bannedUsers} icon={ICON_BAN} />
      </div>

      {/* Users Table */}
      <div className="flex items-center justify-end">
        <Button
          onClick={() => setAddModalOpen(true)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          Add User
        </Button>
      </div>

      <DataTable<UserData>
        columns={columns as { key: string; label: string; render?: (row: UserData) => React.ReactNode }[]}
        data={users}
        searchKey="name"
        searchPlaceholder="Search by name or email..."
        actions={actions}
        gridColumns="1.5fr 2fr 0.8fr 0.8fr 0.8fr 1fr 80px"
      />

      {/* View User Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="User Details" width="600px">
        {selectedUser && (
          <div className="space-y-4">
            {/* User header */}
            <div className="mb-4 flex items-center gap-4 rounded-xl bg-white/[0.03] p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-[#E6C36A] to-[#c9a84e] text-xl font-bold text-[#030812] shadow-lg shadow-[#E6C36A]/20">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                <p className="text-xs text-white/60">Joined {selectedUser.joinedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Full Name">
                <Input defaultValue={selectedUser.name} />
              </FormField>
              <FormField label="Email">
                <Input defaultValue={selectedUser.email} type="email" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Status">
                <Select defaultValue={selectedUser.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Banned">Banned</option>
                </Select>
              </FormField>
              <FormField label="Points">
                <Input defaultValue={selectedUser.points} type="number" />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Country">
                <Input defaultValue={selectedUser.country} />
              </FormField>
              <FormField label="Bags">
                <Input defaultValue={selectedUser.bags} type="number" readOnly />
              </FormField>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setModalOpen(false)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add New User" width="650px">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Full name">
              <Input placeholder="Enter full name" />
            </FormField>
            <FormField label="Email address">
              <Input placeholder="Enter email" type="email" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <FormField label="Country code">
              <Input placeholder="e.g. US, UK, CA" />
            </FormField>
            <FormField label="Initial points">
              <Input placeholder="0" type="number" defaultValue={0} />
            </FormField>
          </div>

          <FormField label="Account status">
            <Select defaultValue="Active">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </FormField>

          <div className="flex justify-end gap-3 border-t border-white/[0.08] pt-5 mt-10">
            <Button
              variant="ghost"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setAddModalOpen(false)}
            >
              Create User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

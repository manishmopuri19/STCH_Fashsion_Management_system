import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Trash2, X, Loader2 } from "lucide-react";
import API from "../api/axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate=useNavigate();
  
  // FIXED: Changed 'name' to 'userName' to match your Pydantic schema
  const [newUser, setNewUser] = useState({ 
    userName: "", 
    email: "", 
    password: "", 
    role: "MEMBER" 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Ensure this matches your @router.get("/allusers") endpoint
      const response = await API.get("/allusers"); 
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // POSTs the newUser object with correct 'userName' field
      const response = await API.post("/addNewUser", newUser);
      
      // Since your backend returns {message, user: id}, you might want to re-fetch 
      // or push the new user manually if the backend returns the full object.
      fetchUsers(); 
      setIsModalOpen(false);
      setNewUser({ userName: "", email: "", password: "", role: "MEMBER" });
      navigate("/users")
    } catch (error) {
      // Improved error logging to see FastAPI validation details
      console.error("Error creating user:", error.response?.data?.detail || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.put(`/deleteuser/${id}`); 
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">User Management</h1>
            <p className="text-zinc-400 mt-2">Manage team access and roles</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-medium transition-all"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>

        <div className="bg-[#151821] border border-[#2A3142] rounded-3xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="text-orange-500 animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2A3142] bg-[#1D2230]">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3142]">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1D2230] transition-colors">
                    {/* Fixed: Display user.userName from the backend model */}
                    <td className="px-6 py-4 text-sm text-white font-medium">{user.userName}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-zinc-500 text-sm">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151821] border border-[#2A3142] rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-[#2A3142] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {/* FIXED: value and onChange now target userName */}
              <ModalInput 
                label="User Name" 
                value={newUser.userName} 
                onChange={(v)=>setNewUser({...newUser, userName: v})} 
                placeholder="Full Name" 
              />
              <ModalInput 
                label="Email Address" 
                type="email" 
                value={newUser.email} 
                onChange={(v)=>setNewUser({...newUser, email: v})} 
                placeholder="email@domain.com" 
              />
              <ModalInput 
                label="Password" 
                type="password" 
                value={newUser.password} 
                onChange={(v)=>setNewUser({...newUser, password: v})} 
              />
              
              <div className="flex flex-col">
                <label className="mb-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                <select 
                  value={newUser.role} 
                  onChange={(e)=>setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#2A3142] bg-[#0F141D] text-white text-sm outline-none focus:border-orange-500"
                >
                  {/* Ensure these values match your Python UserRole enum (usually uppercase) */}
                  <option value="ADMIN">ADMIN</option>
                  <option value="MEMBER">MEMBER</option>
                  <option value="MERCHANDISER">MERCHANDISER</option>
                  <option value="SUPPLIER">SUPPLIER</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#2A3142] text-zinc-400 font-medium hover:bg-[#1D2230]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-400"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ModalInput = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col">
    <label className="mb-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg border border-[#2A3142] bg-[#0F141D] text-white text-sm outline-none focus:border-orange-500"
      required
    />
  </div>
);

export default UserManagement;
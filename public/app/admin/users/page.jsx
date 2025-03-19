"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";
export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const [profilePictureUrls, setProfilePictureUrls] = useState({});
    // State for "Create User" form
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newName, setNewName] = useState("");
    const [newDOB, setNewDOB] = useState("");
    const [newProfilePic, setNewProfilePic] = useState("");
    const [newBio, setNewBio] = useState("");
    const [newInterests, setNewInterests] = useState("");
    const [newLinkedIn, setNewLinkedIn] = useState("");
    const [newTwitter, setNewTwitter] = useState("");
    const [newFacebook, setNewFacebook] = useState("");
    const [newTags, setNewTags] = useState("");
    // State for search, filter, and sort
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    // State for feedback messages
    const [feedback, setFeedback] = useState("");
    // State for collapsing panels
    const [isCreateFormCollapsed, setIsCreateFormCollapsed] = useState(true);
    const [expandedUserId, setExpandedUserId] = useState(null);
    // Fetch profile picture URLs from Firebase Storage
    const fetchProfilePictureUrl = async (userId) => {
        try {
            const storageRef = ref(storage, `profile-pictures/${userId}`);
            // Check if the file exists
            const result = await listAll(ref(storage, "profile-pictures"));
            const fileExists = result.items.some((item) => item.name === userId);
            if (fileExists) {
                const url = await getDownloadURL(storageRef);
                setProfilePictureUrls((prev) => (Object.assign(Object.assign({}, prev), { [userId]: url })));
            }
            else {
                // Use default placeholder if file doesn't exist
                setProfilePictureUrls((prev) => (Object.assign(Object.assign({}, prev), { [userId]: "/default-user.png" })));
            }
        }
        catch (error) {
            console.error("Error fetching profile picture:", error);
            setProfilePictureUrls((prev) => (Object.assign(Object.assign({}, prev), { [userId]: "/default-user.png" })));
        }
    };
    useEffect(() => {
        const checkAdminAndFetchUsers = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push("/");
                return;
            }
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists() || userDoc.data().role !== "admin") {
                router.push("/dashboard");
                return;
            }
            setIsAdmin(true);
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersList = usersSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
                setUsers(usersList);
                // Fetch profile picture URLs for each user
                usersList.forEach((user) => {
                    fetchProfilePictureUrl(user.id);
                });
            }
            catch (error) {
                console.error("Error fetching users:", error);
                setFeedback("Error fetching users. Please try again.");
            }
            finally {
                setLoading(false);
            }
        };
        checkAdminAndFetchUsers();
    }, [router]);
    const handleCreateUser = async () => {
        if (!newEmail || !newPassword) {
            setFeedback("Email and password are required.");
            return;
        }
        try {
            const id = Math.random().toString(36).slice(2);
            const tagsArray = newTags.split(",").map((tag) => tag.trim());
            await setDoc(doc(db, "users", id), {
                email: newEmail,
                password: newPassword, // Note: In a real app, hash passwords before storing!
                name: newName,
                dob: newDOB,
                profilePic: newProfilePic,
                bio: newBio,
                interests: newInterests,
                linkedIn: newLinkedIn,
                twitter: newTwitter,
                facebook: newFacebook,
                role: "user", // Default role
                tags: tagsArray, // Store tags as an array
            });
            setUsers([
                ...users,
                {
                    id,
                    email: newEmail,
                    name: newName,
                    role: "user",
                    profilePic: newProfilePic,
                    tags: tagsArray,
                },
            ]);
            setNewEmail("");
            setNewPassword("");
            setNewName("");
            setNewDOB("");
            setNewProfilePic("");
            setNewBio("");
            setNewInterests("");
            setNewLinkedIn("");
            setNewTwitter("");
            setNewFacebook("");
            setNewTags("");
            setFeedback("User created successfully!");
        }
        catch (error) {
            console.error("Error creating user:", error);
            setFeedback("Error creating user. Please try again.");
        }
    };
    const handleUpdateRole = async (user) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        try {
            await setDoc(doc(db, "users", user.id), { role: newRole }, { merge: true });
            setUsers(users.map((u) => (u.id === user.id ? Object.assign(Object.assign({}, u), { role: newRole }) : u)));
            setFeedback(`User role updated to ${newRole}.`);
        }
        catch (error) {
            console.error("Error updating role:", error);
            setFeedback("Error updating role. Please try again.");
        }
    };
    const handleDeleteUser = async (user) => {
        if (confirm(`Are you sure you want to delete ${user.email}?`)) {
            try {
                await deleteDoc(doc(db, "users", user.id));
                setUsers(users.filter((u) => u.id !== user.id));
                setFeedback("User deleted successfully.");
            }
            catch (error) {
                console.error("Error deleting user:", error);
                setFeedback("Error deleting user. Please try again.");
            }
        }
    };
    const filteredUsers = users
        .filter((user) => {
        var _a, _b, _c;
        const searchTermLower = searchTerm.toLowerCase();
        return (((_a = user.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTermLower)) ||
            ((_b = user.email) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchTermLower)) ||
            ((_c = user.tags) === null || _c === void 0 ? void 0 : _c.some((tag) => tag.toLowerCase().includes(searchTermLower))));
    })
        .filter((user) => {
        if (filterRole === "all")
            return true;
        return user.role === filterRole;
    })
        .sort((a, b) => {
        var _a, _b;
        if (sortBy === "name") {
            return ((_a = a.name) === null || _a === void 0 ? void 0 : _a.localeCompare(b.name)) || 0;
        }
        if (sortBy === "email") {
            return ((_b = a.email) === null || _b === void 0 ? void 0 : _b.localeCompare(b.email)) || 0;
        }
        return 0;
    });
    if (loading) {
        return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
    }
    if (!isAdmin) {
        return null;
    }
    return (<div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        Admin Panel - All Users
      </h1>

      {/* Feedback Message */}
      {feedback && (<div className="mb-4 p-4 rounded bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
          {feedback}
        </div>)}

      {/* Search, Filter, and Sort Controls */}
      <div className="mb-4 flex items-center space-x-4">
        {/* Search Input */}
        <input type="text" placeholder="Search by name, email, or tag" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>

        {/* Filter by Role */}
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* Sort By */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200">
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>
      </div>

      {/* Collapsible Create User Form */}
      <div className="mb-6 bg-white dark:bg-gray-800 hover:bg-green-800 p-6 rounded-2xl shadow">
        <button onClick={() => setIsCreateFormCollapsed(!isCreateFormCollapsed)} className="w-full text-left py-2 font-semibold text-gray-800 dark:text-gray-200">
          {isCreateFormCollapsed ? "Expand to Create New User" : "Collapse Create User Form"}
        </button>

        {!isCreateFormCollapsed && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200" required/>
            <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200" required/>
            <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="date" placeholder="Date of Birth" value={newDOB} onChange={(e) => setNewDOB(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="Profile Picture URL" value={newProfilePic} onChange={(e) => setNewProfilePic(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <textarea placeholder="Bio" value={newBio} onChange={(e) => setNewBio(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="Interests" value={newInterests} onChange={(e) => setNewInterests(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="LinkedIn URL" value={newLinkedIn} onChange={(e) => setNewLinkedIn(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="Twitter URL" value={newTwitter} onChange={(e) => setNewTwitter(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="Facebook URL" value={newFacebook} onChange={(e) => setNewFacebook(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <input type="text" placeholder="Tags (comma-separated)" value={newTags} onChange={(e) => setNewTags(e.target.value)} className="p-2 border rounded dark:bg-gray-700 dark:text-gray-200"/>
            <button onClick={handleCreateUser} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Add User
            </button>
          </div>)}
      </div>

      {/* Users List */}
      {filteredUsers.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          
          
          
          {filteredUsers.map((user) => (<div key={user.id} className="bg-white dark:bg-gray-800 hover:bg-blue-800 p-4 rounded shadow cursor-pointer" onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}>
    {/* Profile Picture */}
    <div className="flex justify-center mb-2">
      <img src={profilePictureUrls[user.id] || "/default-user.png"} alt={`${user.name}'s Profile`} className="w-20 h-20 rounded-full object-cover"/>
    </div>

    {/* User Details */}
    <h3 className="font-semibold text-xl text-gray-700 dark:text-gray-300">
      {user.name || "No name"}
    </h3>

    {expandedUserId === user.id && (<div>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Role:</strong> {user.role || "user"}
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Email:</strong> {user.email || "No email"}
        </p>
        <p className="text-gray-500 dark:text-gray-500">
          <strong>ID:</strong> {user.id}
        </p>

        {/* Tags */}
        {user.tags && user.tags.length > 0 && (<div className="flex flex-wrap mt-2">
            {user.tags.map((tag, index) => (<span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded mr-2 mb-1 text-sm">
                {tag}
              </span>))}
          </div>)}

        <div className="flex justify-between mt-4">
          {/* Update Role Button */}
          <button onClick={(e) => {
                        e.stopPropagation(); // Prevent the card from collapsing/expanding
                        handleUpdateRole(user);
                    }} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Toggle Role
          </button>

          {/* Delete Button */}
          <button onClick={(e) => {
                        e.stopPropagation(); // Prevent the card from collapsing/expanding
                        handleDeleteUser(user);
                    }} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>)}
  </div>))}



        </div>) : (<p className="text-gray-600 dark:text-gray-400">No users found.</p>)}
    </div>);
}

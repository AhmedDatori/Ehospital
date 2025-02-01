/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/20/solid";
import { AppContext } from "../../context/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminSpecializations = () => {
    const {
        //specialities,
        getSpecialities,
        createSpeciality,
        updateSpeciality,
        deleteSpeciality,
        accessToken,
        currentUser,
    } = useContext(AppContext);
    const [specialities, setSpecialities] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [newSpecialization, setNewSpecialization] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    const fetchSpecialities = async () => {
            if (!accessToken) {
                navigate("/dashboard/login");
            } else if (currentUser) {
                const response = await getSpecialities();
                setSpecialities(response || []);
            }
    }

    useEffect(() => {
        fetchSpecialities();
    }, []);

    // editing
    const handleEdit = (speciality) => {
        setEditingId(speciality.id);
        setEditedName(speciality.name);
        fetchSpecialities();
    };

    // Save
    const handleSave = async (specialityId) => {
        try {
            await updateSpeciality({ id: specialityId, name: editedName });
            setEditingId(null); // Exit edit mode
        } catch (error) {
            console.error("Error updating specialization:", error);
            toast.error("Failed to update specialization");
        }
        fetchSpecialities();
    };

    // deleting
    const handleDelete = async (specialityId) => {
        try {
            await deleteSpeciality(specialityId);
        } catch (error) {
            console.error("Error deleting specialization:", error);
            toast.error("Failed to delete specialization");
        }
        fetchSpecialities();
    };

    // adding a new specialization
    const handleAdd = async () => {
        if (!newSpecialization.trim()) {
            toast.error("Specialization name cannot be empty");
            return;
        }

        try {
            await createSpeciality({ name: newSpecialization });
            setNewSpecialization("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding specialization:", error);
            toast.error("Failed to add specialization");
        }
        fetchSpecialities();
    };

    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        if (!accessToken) {
            navigate("/dashboard/login");
        } else if (currentUser) {
            setIsAdmin(currentUser.role === "admin");
        }
    }, [accessToken, currentUser, navigate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Specializations</h1>

            {isAdmin && (
                <div className="mb-6">
                    {isAdding ? (
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={newSpecialization}
                                onChange={(e) => setNewSpecialization(e.target.value)}
                                className="border border-gray-300 rounded-md p-2"
                                placeholder="Enter new specialization"
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            <PlusIcon className="size-5 inline-block mr-2" />
                            Add Specialization
                        </button>
                    )}
                </div>
            )}

            {specialities.length > 0 ? (
                <ul className="space-y-4">
                    {specialities.map((speciality) => (
                        <li
                            key={speciality.id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                        >
                            {editingId === speciality.id ? (
                                isAdmin && (
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border border-gray-300 rounded-md p-2"
                                        />
                                        <button
                                            onClick={() => handleSave(speciality.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-semibold">
                                        {speciality.name}
                                    </span>
                                    {isAdmin && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(speciality)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilIcon className="size-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(speciality.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="size-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No specializations found.</p>
            )}
        </div>
    );
};

export default AdminSpecializations;

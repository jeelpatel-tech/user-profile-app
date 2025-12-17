"use client";

import { useState, useRef } from "react";
import { UserProfile } from "../context/AuthContext";
import { Camera, Save, X, Calendar, User as UserIcon, Ruler, UserCircle } from "lucide-react";

interface ProfileFormProps {
    initialData: UserProfile;
    onSave: (data: UserProfile, file?: File) => Promise<void> | void;
    readOnly?: boolean;
}

export function ProfileForm({ initialData, onSave, readOnly = false }: ProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(initialData);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData, selectedFile || undefined);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    const isEditable = !readOnly && isEditing;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                {!readOnly && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-8 flex flex-col items-center sm:items-start sm:flex-row sm:justify-between">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={formData.image || "https://api.dicebear.com/9.x/avataaars/svg?seed=Default"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {isEditable && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pt-16 sm:ml-auto text-center sm:text-right">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{formData.name}</h2>
                        <p className="text-neutral-500 dark:text-neutral-400">{formData.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Gender
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <UserCircle className="h-5 w-5 text-neutral-400" />
                                </div>
                                <select
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all appearance-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Height
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Ruler className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    name="height"
                                    value={formData.height || ""}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    placeholder="e.g. 5'10&quot;"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Date of Birth
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob || ""}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Hobbies (comma separated)
                            </label>
                            <input
                                type="text"
                                value={Array.isArray(formData.hobbies) ? formData.hobbies.join(", ") : formData.hobbies || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value.split(",").map(s => s.trim()) }))}
                                disabled={!isEditable}
                                className="block w-full px-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Interests (comma separated)
                            </label>
                            <input
                                type="text"
                                value={Array.isArray(formData.interests) ? formData.interests.join(", ") : formData.interests || ""}
                                onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value.split(",").map(s => s.trim()) }))}
                                disabled={!isEditable}
                                className="block w-full px-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            />
                        </div>
                    </div>

                    {isEditable && (
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

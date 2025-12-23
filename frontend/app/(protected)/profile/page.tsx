"use client";

import { useAuth, UserProfile } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileForm } from "../../components/ProfileForm";
import { getUserProfileFromAPI, updateUserProfileInAPI, uploadProfileImage, getProfileImageUrl } from "../../services/profile";
import { useToast } from "../../components/Toast";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const toast = useToast();
    const router = useRouter();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        const loadProfile = async () => {
            if (user?.sub) {
                try {
                    const apiData = await getUserProfileFromAPI(user.sub);
                    let imageUrl = apiData?.image;
                    if (imageUrl && !imageUrl.startsWith('http')) {
                        imageUrl = await getProfileImageUrl(imageUrl);
                    }

                    setProfileData({
                        ...user,
                        ...apiData,
                        image: imageUrl || user.image
                    });
                } catch (err) {
                    console.error("Failed to load profile", err);
                    setProfileData(user);
                } finally {
                    setFetching(false);
                }
            } else if (user) {
                setProfileData(user);
                setFetching(false);
            }
        };

        if (user) {
            loadProfile();
        }
    }, [isLoading, user, router]);

    const handleSave = async (updatedData: UserProfile, file?: File) => {
        if (!user?.sub) return;

        try {
            let imageKey = updatedData.image;

            if (file) {
                imageKey = await uploadProfileImage(file, user.sub);
            } else if (imageKey && imageKey.startsWith('http')) {
                imageKey = undefined;
            }

            const dataToSave: any = {
                ...updatedData,
                image: imageKey,
            };

            // Remove URL from save if it's undefined
            if (!imageKey) delete dataToSave.image;

            // #update
            await updateUserProfileInAPI(user.sub, dataToSave);

            // Reload to get fresh URLs and data
            const freshData = await getUserProfileFromAPI(user.sub);
            let freshUrl = freshData?.image;
            if (freshUrl && !freshUrl.startsWith('http')) {
                freshUrl = await getProfileImageUrl(freshUrl);
            }

            setProfileData(prev => ({
                ...prev,
                ...freshData,
                image: freshUrl || prev?.image
            }));

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    if (isLoading || fetching || !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Profile</h1>
            </div>

            <ProfileForm
                initialData={profileData}
                onSave={handleSave}
            />
        </div>
    );
}

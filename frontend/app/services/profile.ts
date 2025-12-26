import { uploadData, getUrl } from 'aws-amplify/storage';
import { UserProfile } from '../context/AuthContext';

export const getProfileImageUrl = async (key: string) => {
    if (!key) return '';
    if (key.startsWith('http')) return key;
    try {
        const result = await getUrl({ key });
        return result.url.toString();
    } catch (error) {
        console.error("Error getting image URL:", error);
        return '';
    }
};

export const uploadProfileImage = async (file: File, userId: string) => {
    try {
        const extension = file.name.split('.').pop();
        const key = `profile-images/${userId}/avatar.${extension}`;

        const result = await uploadData({
            key: key,
            data: file,
            options: {
                accessLevel: 'guest'
            }
        }).result;

        return result.key;
    } catch (error) {
        throw new Error(`Failed to upload image: ${error}`);
    }
};

export const getUserProfileFromAPI = async (userId: string): Promise<UserProfile | null> => {
    try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch profile');
        }
        return await res.json();
    } catch (error) {
        console.warn("Could not fetch user from API:", error);
        return null;
    }
};

export const updateUserProfileInAPI = async (userId: string, data: Partial<UserProfile>) => {
    try {
        const input = {
            id: userId,
            ...data
        };

        // delete input.email;
        delete input.username;

        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!res.ok) {
            throw new Error('Failed to update profile');
        }

        const json = await res.json();
        return json.item;
    } catch (error) {
        throw new Error(`Failed to update user profile in API: ${error}`);
    }
};

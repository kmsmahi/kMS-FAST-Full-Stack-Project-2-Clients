export const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        
        if (data.success) {
            return data.data.url; // Returns the public image URL
        } else {
            throw new Error("Failed to upload image to ImgBB");
        }
    } catch (error) {
        console.error("Image upload error:", error);
        throw error;
    }
};
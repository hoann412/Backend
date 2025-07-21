import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// Upload files to Firebase Storage
export const uploadFiles = async (files) => {
    const dateTime = getCurrentDateTime();
    const storage = getStorage();
    const fileUrls = [];
    const fileUrlRefs = [];
    const originNames = [];

    try {
        // Use Promise.all to upload all files concurrently
        await Promise.all(
            files.map(async (file) => {
                const storageRef = ref(storage, `files/${file.originalname}/${dateTime}`);
                const urlRef = `files/${file?.originalname}/${dateTime}`;
                fileUrlRefs.push(urlRef);
                originNames.push(file.originalname);

                const metadata = {
                    contentType: file?.mimetype,
                };

                // Upload the file
                const snapshot = await uploadBytesResumable(storageRef, file?.buffer, metadata);

                // Get the download URL
                const downloadURL = await getDownloadURL(snapshot.ref);
                fileUrls.push(downloadURL);
            }),
        );

        return { fileUrls, fileUrlRefs, originNames };
    } catch (error) {
        console.error('Error uploading files: ', error);
        throw new Error('File upload failed');
    }
};

// Helper function to get current date and time
const getCurrentDateTime = () => {
    const today = new Date();
    const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        today.getDate().toString().padStart(2, '0');
    const time =
        today.getHours().toString().padStart(2, '0') +
        ':' +
        today.getMinutes().toString().padStart(2, '0') +
        ':' +
        today.getSeconds().toString().padStart(2, '0');
    const dateTime = `${date}-${time}`;
    return dateTime;
};

export const uploadSingleFile = async (file, folder) => {
    const dateTime = getCurrentDateTime();
    const storage = getStorage();

    const storageRef = ref(storage, `images/${file.originalname}/${dateTime}`);
    const urlRef = `images/${file.originalname}/${dateTime}`;
    const metadata = {
        contentType: file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, file?.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { downloadURL, urlRef };
};

export const removeUploadedFile = async (urlRef) => {
    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, urlRef);

    deleteObject(desertRef)
        .then(() => {
            // File deleted successfully
            console.log(`File deleted successfully`);
        })
        .catch((error) => {
            console.log(error);
        });
};

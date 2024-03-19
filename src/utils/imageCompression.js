import imageCompression from 'browser-image-compression'

const compressFile = async (imageFile) => {
  // Compression options
  const options = {
    // maxSizeMB: 0.005,
    maxSizeMB: 0.5,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  }

  try {
    // Compress the image
    const compressedFile = await imageCompression(imageFile, options)
    // Now, you can use the compressedFile for uploading
    return compressedFile
    // ... Your upload logic here
  } catch (error) {
    console.error('Error compressing image:', error)
  }
}

export default compressFile

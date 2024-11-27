export async function uploadImage(file: File) {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME ?? ''}/image/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', PRESET ?? '')
  return await fetch(URL, {
    method: 'POST',
    body: formData
  }).then(res => res.json())
}

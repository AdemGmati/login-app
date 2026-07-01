'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/client'


const UploadImage = () => {
    const [file, setFile] = useState<File | null>(null)
    const [photos, setPhotos] = useState<any[]>([])
    const supabase = createClient()

    const fetchPhotos = async () => {
        const { error, data } = await supabase
          .from("photos")
          .select("*")
          .order("created_at", { ascending: true });
    
        if (error) {
          console.error("Error reading task: ", error.message);
          return;
        }
    
        setPhotos(data)
    };

    useEffect(() => {
        fetchPhotos()
    }, [])

    const handleUpload = async (file: File): Promise<string | null> => {
        const filePath = `images/${file.name}-${Date.now()}`
        
        const {error} = await supabase.storage.from("photos").upload(filePath, file)

        if (error) {
            console.error('Error uploading image:', error.message)
            return null
        }

        const {data} = await supabase.storage.from("photos").getPublicUrl(filePath)

        return data.publicUrl
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let imageUrl: string | null = null
        if (file) {
            imageUrl = await handleUpload(file)
        }

        const { error } = await supabase
        .from("photos")
        .insert({ image_url: imageUrl })
        .select()
        .single();

        if (error) {
            console.error("Error adding photo: ", error.message);
            return;
        }

        await fetchPhotos()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

        return (
            <div className="max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block flex-1 text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                    />
                    <button type="submit" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                        Upload
                    </button>
                </form>
                <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo) => (
                        <img key={photo.id} src={photo.image_url} alt={photo.id} width={100} height={100} className="h-24 w-full rounded-md object-cover" />
                    ))}
                </div>
            </div>
        )
}

    export default UploadImage
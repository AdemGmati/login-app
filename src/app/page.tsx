import { LogoutButton } from '@/components/logout-button'
import UploadImage from '@/components/upload-image'

const page = async () => {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
            <p className="mt-1 text-sm text-gray-500">Upload and view your photos</p>
          </div>
          <LogoutButton />
        </div>

        <UploadImage />
      </div>
    </div>
  )
}

export default page
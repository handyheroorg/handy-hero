import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { BasicProps, File } from '@/types'
import { useUploadFile } from '@/hooks'
import { cn } from '@/lib'

const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

type FileUploaderProps = BasicProps & {
  onChange?: (fileUploaded: File) => void
  allowedMimeTypes: string[]
  maxSize?: number
}

export default function FileUploader({
  className,
  style,
  onChange,
  allowedMimeTypes,
  maxSize = DEFAULT_MAX_FILE_SIZE,
}: FileUploaderProps) {
  const { isUploading, upload, uploadedFile } = useUploadFile({ onSuccess: onChange })

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0]
    if (!file) return

    if (!allowedMimeTypes.includes(file.type)) {
      return toast('Unsupported file format!')
    }

    if (file.size > maxSize) {
      return toast('File size is too large, it should be less than 2MB!')
    }

    upload(file)
  }

  const fileExtensions = allowedMimeTypes.map((t) => t.split('/')[1]).map((t) => `.${t}`)

  return (
    <label
      htmlFor="file-uploader"
      className={cn(
        'rounded-full w-96 overflow-hidden relative flex-col gap-2 text-sm text-muted-foreground h-96 border border-dashed flex items-center justify-center text-center cursor-pointer',
        className,
      )}
      style={style}
    >
      <input
        type="file"
        id="file-uploader"
        className="hidden"
        disabled={isUploading}
        accept={fileExtensions.join(',')}
        onChange={handleFileUpload}
      />

      {isUploading && <Loader className="animate-spin" />}

      <div className="z-10">
        <p>Allowed file types are {fileExtensions.join(', ')}</p>
        <p>Max file size is 2MB</p>
      </div>

      {uploadedFile ? (
        <img
          src={uploadedFile.publicUrl}
          alt={uploadedFile.originalName}
          className="absolute inset-0 opacity-10 w-full h-full object-cover"
        />
      ) : null}
    </label>
  )
}

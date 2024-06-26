import { PackageSearchIcon } from 'lucide-react'
import { cn } from '@/lib'
import { BasicProps } from '@/types'

type EmptyMessageProps = BasicProps & {
  title?: string
  description?: string
}

export default function EmptyMessage({
  title = 'No items found',
  description = 'Create create a new item to get started',
  className,
  style,
}: EmptyMessageProps) {
  return (
    <div className={cn('p-4 text-sm', className)} style={style}>
      <PackageSearchIcon className="mx-auto mb-2 h-10 w-10" strokeWidth={1.25} />
      <div className="text-center font-medium">{title}</div>
      <div className="text-center text-muted-foreground">{description}</div>
    </div>
  )
}

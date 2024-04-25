import { AlertOctagonIcon } from 'lucide-react'
import { BasicProps } from '@/types'
import { cn } from '@/lib'

type ErrorMessageProps = BasicProps & {
  title?: string
  description?: string
}

export default function ErrorMessage({
  title = 'Error',
  description = 'Something went wrong. Please try again',
  className,
  style,
}: ErrorMessageProps) {
  return (
    <div className={cn('p-4 text-sm', className)} style={style}>
      <AlertOctagonIcon className="mx-auto mb-2 h-10 w-10" strokeWidth={1.25} />
      <div className="text-center font-medium">{title}</div>
      <div className="text-center text-muted-foreground">{description}</div>
    </div>
  )
}

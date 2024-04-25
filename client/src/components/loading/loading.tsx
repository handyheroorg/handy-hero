import { Loader2Icon } from 'lucide-react'
import { BasicProps } from '@/types'
import { cn } from '@/lib'

type LoadingProps = BasicProps & {
  title?: string
  description?: string
}

export default function Loading({ className, style, title = 'Loading...', description }: LoadingProps) {
  return (
    <div className={cn('text-center flex items-center justify-center flex-col gap-2', className)} style={style}>
      <Loader2Icon className="animate-spin" />
      <h1 className="text-sm">{title}</h1>

      {!!description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

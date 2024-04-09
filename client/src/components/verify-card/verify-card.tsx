import { cloneElement } from 'react'
import { cn } from '@/lib'
import { BasicProps } from '@/types'

type VerifyCardProps = BasicProps & {
  iconClassName?: string
  icon: React.ReactElement<{ className?: string }>
  title: string
  description: string
}

export default function VerifyCard({ className, style, icon, iconClassName, title, description }: VerifyCardProps) {
  return (
    <div className={cn('flex gap-x-4 border rounded-lg px-8 py-6 md:min-w-96', className)} style={style}>
      {cloneElement(icon, { className: cn(iconClassName, 'size-6') })}

      <div>
        <h1 className="text-lg font-medium mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

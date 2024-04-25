import { cloneElement } from 'react'
import { cn } from '@/lib'
import { BasicProps } from '@/types'

type StatCardProps = BasicProps & {
  title: string
  value: string | number
  icon: React.ReactElement<{ className?: string }>
  iconClassName?: string
  onClick?: () => void
}

export default function StatCard({ className, style, title, value, icon, iconClassName, onClick }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex gap-x-4 p-4 rounded-lg border shadow-sm',
        typeof onClick === 'function' && 'cursor-pointer',
        className,
      )}
      style={style}
      onClick={onClick}
    >
      {cloneElement(icon, { className: cn('size-5', iconClassName) })}

      <div>
        <p className="text-lg font-medium mb-1">{title}</p>
        <h1 className="text-2xl font-bold">{value}</h1>
      </div>
    </div>
  )
}

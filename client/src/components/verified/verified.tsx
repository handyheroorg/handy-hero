import { BadgeCheckIcon } from 'lucide-react'
import { cn } from '@/lib'
import { BasicProps } from '@/types'

type VerifiedProps = BasicProps & {
  title: string
}

export default function Verified({ className, style, title }: VerifiedProps) {
  return (
    <div
      className={cn(
        'flex items-center text-emerald-500 gap-x-4 border border-emerald-500 bg-emerald-50 px-4 py-2 rounded-md w-max',
        className,
      )}
      style={style}
    >
      <BadgeCheckIcon className="size-5 " />

      <p>{title} verified</p>
    </div>
  )
}

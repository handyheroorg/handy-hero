import { cn } from '@/lib'

type ContainerProps = React.PropsWithChildren<React.HtmlHTMLAttributes<HTMLDivElement>>

export default function Container({ className, style, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-screen-2xl p-4 md:p-0', className)} style={style} {...props}>
      {children}
    </div>
  )
}

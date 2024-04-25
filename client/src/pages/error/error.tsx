import { useRouteError } from 'react-router-dom'

type RouteError = {
  statusText?: string
  status: number
  message?: string
}

export default function Error() {
  const error = useRouteError() as RouteError

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-muted-foreground italic">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

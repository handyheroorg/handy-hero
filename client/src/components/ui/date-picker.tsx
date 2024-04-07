import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BasicProps } from '@/types'

type DatePickerProps = BasicProps & {
  date?: Date
  onChange?: SelectSingleEventHandler
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onChange,
  className,
  style,
  placeholder = 'Pick a date',
  disabled,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal flex w-full border-border',
            !date && 'text-muted-foreground',
            className,
          )}
          style={style}
          icon={<CalendarIcon />}
          disabled={disabled}
        >
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus disabled={disabled} />
      </PopoverContent>
    </Popover>
  )
}

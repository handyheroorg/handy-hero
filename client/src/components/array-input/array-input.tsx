import { useFieldArray, useFormContext } from 'react-hook-form'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { BasicProps } from '@/types'
import { Button, Input, useFormField } from '@/components/ui'

type ArrayInputProps = BasicProps & {
  addButtonLabel?: string
}

export default function ArrayInput({ className, style, addButtonLabel = 'Add' }: ArrayInputProps) {
  const { name } = useFormField()
  const { register, control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })

  return (
    <div className={className} style={style}>
      <div className="mb-2 grid md:grid-cols-2 grid-cols-1 gap-4">
        {fields.map((field, i) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input key={field.id} {...register(`${name}.${i}`)} className="flex-1" />
            <Button
              icon={<MinusIcon />}
              variant="outline"
              type="button"
              onClick={() => {
                remove(i)
              }}
            />
          </div>
        ))}
      </div>

      <Button
        icon={<PlusIcon />}
        type="button"
        variant="secondary"
        onClick={() => {
          append('')
        }}
      >
        {addButtonLabel}
      </Button>
    </div>
  )
}

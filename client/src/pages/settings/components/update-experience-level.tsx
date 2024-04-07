import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn, EXPERIENCE_LEVELS_MAPS, handleError } from '@/lib'
import { updateProfile } from '@/queries'
import { BasicProps, ExperienceLevel } from '@/types'

type UpdateExperienceLevelProps = BasicProps & {
  selectedExperienceLevel: ExperienceLevel
}

export default function UpdateExperienceLevel({
  className,
  style,
  selectedExperienceLevel,
}: UpdateExperienceLevelProps) {
  const qc = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onError: handleError,
    onSuccess(updatedProfile) {
      qc.setQueryData(['profile'], updatedProfile)
    },
  })

  return (
    <div className={cn('flex items-center gap-4', className)} style={style}>
      {Object.entries(EXPERIENCE_LEVELS_MAPS).map(([level, levelData]) => {
        const isSelected = level === selectedExperienceLevel

        return (
          <div
            key={levelData.title}
            className={cn(
              'hover:border-primary border rounded-lg px-6 py-4 flex-1 min-h-36 flex flex-col justify-center gap-2 cursor-pointer',
              isSelected && 'border-primary',
              updateProfileMutation.isPending && 'opacity-50',
            )}
            onClick={() => {
              updateProfileMutation.mutate({ experienceLevel: level as ExperienceLevel })
            }}
          >
            <p className={cn('text-lg font-medium', isSelected && 'text-primary')}>{levelData.title}</p>
            <p className="text-sm text-muted-foreground">{levelData.description}</p>
          </div>
        )
      })}
    </div>
  )
}

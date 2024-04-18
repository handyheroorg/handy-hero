import Select, { MultiValue } from 'react-select'
import { useQuery } from '@tanstack/react-query'
import { BasicProps } from '@/types'
import { findAllSkills } from '@/queries'

type SkillsSelectorProps = BasicProps & {
  defaultValue?: string[]
  value?: string[]
  onChange: (skills: string[]) => void
}

type Option = {
  label: string
  value: string
}

export default function SkillsSelector({ className, value, defaultValue, onChange }: SkillsSelectorProps) {
  const skillsQuery = useQuery({
    queryKey: ['skills'],
    queryFn: findAllSkills,
  })

  return (
    <Select
      className={className}
      placeholder="Select skills"
      defaultValue={defaultValue?.map((value) => ({ label: value, value }))}
      isMulti
      isClearable
      value={value?.map((value) => ({ label: value, value }))}
      isLoading={skillsQuery.isPending}
      options={skillsQuery.data?.map((skill) => ({ label: skill, value: skill }))}
      onChange={(value) => {
        const skills = value as MultiValue<Option>

        onChange(skills.map((skill) => skill.value))
      }}
    />
  )
}

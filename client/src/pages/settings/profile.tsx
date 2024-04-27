import { useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from '@/components/ui'
import { fetchUserProfile } from '@/queries'
import ErrorMessage from '@/components/error-message'
import { cn, EMPLOYMENT_TYPE_CLASSES, formatEnum, getErrorMessage } from '@/lib'
import UpdateBasicProfile from './components/update-basic-profile'
import UpdateExperienceLevel from './components/update-experience-level'
import AddEducationDialog from './components/add-education-dialog'
import AddExperienceDialog from './components/add-experience-dialog'

const NA = 'N/A'
const DATE_FORMAT = 'DD MMM, YYYY'

export function Profile() {
  const [isEdit, setIsEdit] = useState(false)

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
  })

  return match(profileQuery)
    .returnType<React.ReactNode>()
    .with({ status: 'pending' }, () => (
      <div>
        <Skeleton className="w-full h-96 rounded-xl mb-4" />
        <Skeleton className="w-full h-96 rounded-xl mb-4" />
        <Skeleton className="w-full h-96 rounded-xl mb-4" />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => <ErrorMessage description={getErrorMessage(error)} />)
    .with({ status: 'success' }, ({ data: profile }) => (
      <div>
        <Alert className="mb-4" variant={profile.completionPercentage < 100 ? 'warning' : 'success'}>
          <AlertTitle>{profile.completionPercentage < 100 ? 'Incomplete Profile' : 'Profile Completed'}</AlertTitle>
          <AlertDescription>Your profile is {profile.completionPercentage}% complete.</AlertDescription>
        </Alert>

        <h1 className="text-2xl font-bold mb-4">Basic Profile</h1>
        <div className="mb-8">
          {isEdit ? (
            <UpdateBasicProfile
              profile={profile}
              onCancel={() => {
                setIsEdit(false)
              }}
            />
          ) : (
            <div className="px-8 py-6 rounded-xl border relative">
              <Button
                icon={<PencilIcon />}
                variant="outline"
                className="text-primary absolute right-8 top-6 rounded-2xl hover:text-primary"
                onClick={() => {
                  setIsEdit(true)
                }}
              />

              <h2 className="text-2xl font-medium mb-6">{profile.occupation ?? 'Occupation'}</h2>
              <p className="text-muted-foreground mb-4">{profile.about}</p>
              <p className="font-medium mb-4">{profile?.fullAddress ?? NA}</p>

              {!!profile.languages.length && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Languages</p>
                  <div className="flex items-center gap-4">
                    {profile.languages.map((language) => (
                      <div key={language} className="px-4 py-2 text-center rounded-full bg-muted capitalize">
                        {language}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!!profile.skills.length && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex items-center gap-4">
                    {profile.skills.map((skill) => (
                      <div key={skill} className="px-4 py-2 text-center rounded-full bg-muted capitalize">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-6 rounded-xl border mb-8">
          <h1 className="text-2xl mb-4">Experience Level</h1>

          <UpdateExperienceLevel selectedExperienceLevel={profile.experienceLevel} />
        </div>

        <div className="px-8 py-6 rounded-xl border mb-8">
          <div className="flex items-center gap-x-4 justify-between mb-4">
            <h1 className="text-2xl mb-4">Education</h1>

            <AddEducationDialog education={profile.education} />
          </div>

          {profile.education.map((study, i) => (
            <div key={i} className="border-l pl-4 mb-8">
              <h1 className="text-xl font-medium mb-2">{study.school}</h1>
              <p>
                {study.degree} {!!study.fieldOfStudy && `(${study.fieldOfStudy})`}
              </p>

              <p className="text-sm text-muted-foreground mb-2">
                {dayjs(study.startDate).format(DATE_FORMAT)} - {dayjs(study.endDate).format(DATE_FORMAT)}
              </p>

              <p>{study.description}</p>
            </div>
          ))}
        </div>

        <div className="px-8 py-6 rounded-xl border mb-8">
          <div className="flex items-center gap-x-4 justify-between mb-4">
            <h1 className="text-2xl mb-4">Experience</h1>

            <AddExperienceDialog experience={profile.experience} />
          </div>

          {profile.experience.map((exp, i) => {
            const classes = EMPLOYMENT_TYPE_CLASSES[exp.employmentType]

            return (
              <div key={i} className="border-l pl-4 mb-8">
                <div className="flex md:items-center md:justify-between flex-col md:flex-row">
                  <div>
                    <h1 className="text-xl font-medium mb-4">{exp.title}</h1>
                    <p>
                      {exp.company} {!!exp.industry && `(${exp.industry})`}
                    </p>
                  </div>

                  <div className={cn('px-6 py-2 rounded-full border', classes)}>{formatEnum(exp.employmentType)}</div>
                </div>

                <p className="mb-4 text-sm">
                  {dayjs(exp.startDate).format(DATE_FORMAT)} -{' '}
                  {exp.currentlyWorkingHere ? 'Present' : dayjs(exp.endDate).format(DATE_FORMAT)}
                </p>

                <p className="text-sm text-muted-foreground ">{exp.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    ))
    .exhaustive()
}

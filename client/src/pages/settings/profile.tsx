import { useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { Button, Skeleton } from '@/components/ui'
import { fetchUserProfile } from '@/queries'
import ErrorMessage from '@/components/error-message'
import { getErrorMessage } from '@/lib'
import UpdateBasicProfile from './components/update-basic-profile'
import UpdateExperienceLevel from './components/update-experience-level'
import AddEducationDialog from './components/add-education-dialog'

const NA = 'N/A'

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

          <UpdateExperienceLevel selectedExperienceLevel={profile.experienceLevel} />
        </div>
      </div>
    ))
    .exhaustive()
}

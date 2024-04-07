import { useState } from 'react'
import { PencilIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import { Button, Skeleton } from '@/components/ui'
import { fetchUserProfile } from '@/queries'
import ErrorMessage from '@/components/error-message'
import { EXPERIENCE_LEVELS_MAPS, getErrorMessage } from '@/lib'
import UpdateBasicProfile from './components/update-basic-profile'

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

        <div className="px-8 py-6 rounded-xl border">
          <h1 className="text-2xl mb-4">Experience Level</h1>

          <div className="flex items-center gap-4">
            {Object.values(EXPERIENCE_LEVELS_MAPS).map((level) => (
              <div
                key={level.title}
                className="hover:border-primary border rounded-lg px-6 py-4 flex-1 min-h-36 flex flex-col justify-center gap-2 cursor-pointer"
              >
                <p className="text-lg font-medium">{level.title}</p>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))
    .exhaustive()
}

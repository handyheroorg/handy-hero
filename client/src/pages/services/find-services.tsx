import { SearchIcon, XIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'
import dayjs from 'dayjs'
import { Link, useSearchParams } from 'react-router-dom'
import { omit } from 'remeda'
import Container from '@/components/container'
import { findServices } from '@/queries'
import Loading from '@/components/loading'
import ErrorMessage from '@/components/error-message'
import { formatEnum, getErrorMessage } from '@/lib'
import { FindServicesFiltersDto, PriceType } from '@/types'
import EmptyMessage from '@/components/empty-message'
import SkillsSelector from '@/components/skills-selector'
import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider } from '@/components/ui'

export function FindServices() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = {
    query: searchParams.get('query'),
    skills: searchParams.getAll('skills'),
    priceType: (searchParams.get('priceType') ?? undefined) as PriceType,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
  } satisfies FindServicesFiltersDto

  const isFilterApplied = [...Object.values(omit(filters, ['skills'])), filters.skills?.length].some(Boolean)

  const servicesQuery = useQuery({
    queryKey: ['find-services', filters],
    queryFn: () => findServices(filters),
  })

  return (
    <Container className="!py-4 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-4">
        <div className="w-full rounded-2xl bg-emerald-800 h-56 mb-4 flex items-center text-white gap-4 px-10 py-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find the Right Fit for Your Needs</h1>
            <p className="text-sm">
              Explore a wide range of services and find the perfect match for your requirements. Use our search and
              filters to discover services tailored to your preferences.
            </p>
          </div>
          <div className="w-1/3">
            <img src="/search.svg" className="w-full h-44 object-contain" alt="search" />
          </div>
        </div>

        <div className="border rounded-full py-2 px-4 flex items-center gap-4 mb-4">
          <input
            type="text"
            className="flex-1 active:border-none outline-none"
            placeholder="Search for services"
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set('query', e.target.value)
                return prev
              })
            }}
          />
          <SearchIcon className="size-5 text-muted-foreground" />
        </div>

        <h1 className="text-lg font-medium mb-4">Services you might like</h1>

        {match(servicesQuery)
          .with({ status: 'pending' }, () => <Loading title="Fetching services..." />)
          .with({ status: 'error' }, ({ error }) => <ErrorMessage description={getErrorMessage(error)} />)
          .with({ status: 'success' }, ({ data }) => {
            if (data.length === 0) {
              return (
                <EmptyMessage
                  title="No services found"
                  description="Try applying different filters to find other services"
                />
              )
            }

            return (
              <div className="space-y-4">
                {data.map((service) => (
                  <Link
                    key={service.id}
                    className="border-b p-4 hover:bg-muted-foreground/10 cursor-pointer block"
                    to={`/services/${service.id}`}
                  >
                    <p className="text-xs text-muted-foreground">Posted {dayjs(service.createdAt).fromNow()}</p>
                    <h1 className="text-lg font-bold mb-2">{service.name}</h1>

                    <div className="text-xs flex items-center gap-2 mb-4">
                      <p>{formatEnum(service.priceType)} price</p>
                      <p>${service.price}</p>
                    </div>

                    <p className="mb-4">{service.description}</p>

                    <div className="flex items-center gap-4 flex-wrap">
                      {service.skills.map((skill, i) => (
                        <div
                          key={`${skill}-${i}`}
                          className="rounded-full px-4 py-2 text-sm bg-muted-foreground/10 text-muted-foreground"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )
          })
          .exhaustive()}
      </div>
      <div>
        <div className="w-full rounded-2xl bg-emerald-800 h-56 mb-4" />

        <div className="bg-muted-foreground/10 p-4 rounded-2xl">
          <div className="mb-4 flex items-center gap-2 justify-between">
            <h2 className="text-lg font-medium">Filters</h2>

            {isFilterApplied && (
              <Button
                icon={<XIcon />}
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchParams({})
                }}
              />
            )}
          </div>

          <SkillsSelector
            className="mb-4"
            value={filters.skills}
            onChange={(skills) => {
              setSearchParams((prev) => {
                if (skills.length === 0) {
                  prev.delete('skills')
                  return prev
                }

                skills.forEach((skill) => prev.append('skills', skill))
                return prev
              })
            }}
          />

          <div className="mb-4">
            <Select
              defaultValue={filters.priceType}
              onValueChange={(priceType) => {
                setSearchParams((prev) => {
                  prev.set('priceType', priceType)
                  return prev
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select price type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="HOURLY">Hourly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <Label className="mb-4 block">Min Price {filters.minPrice && `($${filters.minPrice})`}</Label>
            <Slider
              value={[filters.minPrice ?? 0]}
              min={0}
              step={5}
              max={1000}
              onValueChange={(value) => {
                setSearchParams((prev) => {
                  prev.set('minPrice', value[0].toString())
                  return prev
                })
              }}
            />
          </div>

          <div className="mb-4">
            <Label className="mb-4 block">Max Price {filters.maxPrice && `($${filters.maxPrice})`}</Label>
            <Slider
              value={[filters.maxPrice ?? 0]}
              min={Number(filters.minPrice)}
              max={Number(filters.minPrice) + 1000}
              onValueChange={(value) => {
                setSearchParams((prev) => {
                  prev.set('maxPrice', value[0].toString())
                  return prev
                })
              }}
            />
          </div>
        </div>
      </div>
    </Container>
  )
}

import { Reflector } from '@nestjs/core'

export const Role = Reflector.createDecorator<'CLIENT' | 'SERVICE_PROVIDER'>()

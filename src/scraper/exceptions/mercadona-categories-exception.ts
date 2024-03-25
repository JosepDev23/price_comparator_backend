import { HttpException, HttpStatus } from '@nestjs/common'

export class MercadonaCategoriesException extends HttpException {
  constructor() {
    super('Mercadona categories could not be retrieved', HttpStatus.BAD_GATEWAY)
  }
}

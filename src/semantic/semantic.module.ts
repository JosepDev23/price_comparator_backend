import { Module } from '@nestjs/common'
import { SemanticService } from './semantic.service'

@Module({
  providers: [SemanticService],
})
export class SemanticModule {}

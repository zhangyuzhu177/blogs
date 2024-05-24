import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    UserModule,
  ],

  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

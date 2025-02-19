import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IJwtPayload } from '@novu/shared';
import { CreateNotificationGroup } from './usecases/create-notification-group/create-notification-group.usecase';
import { Roles } from '../auth/framework/roles.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { CreateNotificationGroupCommand } from './usecases/create-notification-group/create-notification-group.command';
import { CreateNotificationGroupRequestDto } from './dtos/create-notification-group-request.dto';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { GetNotificationGroups } from './usecases/get-notification-groups/get-notification-groups.usecase';
import { GetNotificationGroupsCommand } from './usecases/get-notification-groups/get-notification-groups.command';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationGroupResponseDto } from './dtos/notification-group-response.dto';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { GetNotificationGroup } from './usecases/get-notification-group/get-notification-group.usecase';
import { GetNotificationGroupCommand } from './usecases/get-notification-group/get-notification-group.command';
import { DeleteNotificationGroup } from './usecases/delete-notification-group/delete-notification-group.usecase';
import { DeleteNotificationGroupCommand } from './usecases/delete-notification-group/delete-notification-group.command';
import { DeleteNotificationGroupResponseDto } from './dtos/delete-notification-group-response.dto';
import { UpdateNotificationGroupCommand } from './usecases/update-notification-group/update-notification-group.command';
import { UpdateNotificationGroup } from './usecases/update-notification-group/update-notification-group.usecase';
import { ApiResponse } from '../shared/framework/response.decorator';

@Controller('/notification-groups')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Notification groups')
export class NotificationGroupsController {
  constructor(
    private createNotificationGroupUsecase: CreateNotificationGroup,
    private getNotificationGroupsUsecase: GetNotificationGroups,
    private getNotificationGroupUsecase: GetNotificationGroup,
    private deleteNotificationGroupUsecase: DeleteNotificationGroup,
    private updateNotificationGroupUsecase: UpdateNotificationGroup
  ) {}

  @Post('')
  @ExternalApiAccessible()
  @ApiResponse(NotificationGroupResponseDto, 201)
  @ApiOperation({
    summary: 'Create notification group',
  })
  createNotificationGroup(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateNotificationGroupRequestDto
  ): Promise<NotificationGroupResponseDto> {
    return this.createNotificationGroupUsecase.execute(
      CreateNotificationGroupCommand.create({
        organizationId: user.organizationId,
        userId: user._id,
        environmentId: user.environmentId,
        name: body.name,
      })
    );
  }

  @Get('')
  @ExternalApiAccessible()
  @ApiResponse(NotificationGroupResponseDto, 200, true)
  @ApiOperation({
    summary: 'Get notification groups',
  })
  getNotificationGroups(@UserSession() user: IJwtPayload): Promise<NotificationGroupResponseDto[]> {
    return this.getNotificationGroupsUsecase.execute(
      GetNotificationGroupsCommand.create({
        organizationId: user.organizationId,
        userId: user._id,
        environmentId: user.environmentId,
      })
    );
  }

  @Get('/:id')
  @ExternalApiAccessible()
  @ApiResponse(NotificationGroupResponseDto, 200)
  @ApiOperation({
    summary: 'Get notification group',
  })
  getNotificationGroup(
    @UserSession() user: IJwtPayload,
    @Param('id') id: string
  ): Promise<NotificationGroupResponseDto> {
    return this.getNotificationGroupUsecase.execute(
      GetNotificationGroupCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        userId: user._id,
        id,
      })
    );
  }

  @Patch('/:id')
  @ExternalApiAccessible()
  @ApiResponse(NotificationGroupResponseDto, 200)
  @ApiOperation({
    summary: 'Update notification group',
  })
  updateNotificationGroup(
    @UserSession() user: IJwtPayload,
    @Param('id') id: string,
    @Body() body: CreateNotificationGroupRequestDto
  ): Promise<NotificationGroupResponseDto> {
    return this.updateNotificationGroupUsecase.execute(
      UpdateNotificationGroupCommand.create({
        organizationId: user.organizationId,
        userId: user._id,
        environmentId: user.environmentId,
        name: body.name,
        id,
      })
    );
  }

  @Delete('/:id')
  @ExternalApiAccessible()
  @ApiResponse(DeleteNotificationGroupResponseDto, 200)
  @ApiOperation({
    summary: 'Delete notification group',
  })
  deleteNotificationGroup(
    @UserSession() user: IJwtPayload,
    @Param('id') id: string
  ): Promise<DeleteNotificationGroupResponseDto> {
    return this.deleteNotificationGroupUsecase.execute(
      DeleteNotificationGroupCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        userId: user._id,
        id,
      })
    );
  }
}

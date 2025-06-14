import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponseType } from 'src/utils/response.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';
import { ApiResponseDto } from 'src/utils/api-response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponseType> {
    return this.userService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  async getProfile(@Request() req): Promise<ApiResponseType> {
    return this.userService.getProfile(req.user.id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Put('update-profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ApiResponseType> {
    return this.userService.updateProfile(req.user.id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ApiResponseType> {
    return this.userService.changePassword(req.user.id, changePasswordDto);
  }

  @ApiOperation({ summary: 'Fetch users by name' })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully.',
    type: ApiResponseDto,
  })
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'name', required: true, type: String })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Get()
  async fetchUsersByName(
    @Query('name') name: string,
  ): Promise<ApiResponseType> {
    return this.userService.fetchUsersByName(name);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseType> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: ApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<ApiResponseType> {
    return this.userService.deleteUser(id);
  }
}

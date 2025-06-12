import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/auth.dto';
import { ApiResponseType, createApiResponse } from 'src/utils/response.util';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<ApiResponseType> {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return createApiResponse({
      statusCode: HttpStatus.OK,
      data: {
        token: token,
      },
    });
  }

  async register(createUserDto: CreateUserDto): Promise<ApiResponseType> {
    try {
      // Sử dụng UserService để tạo người dùng mới
      const result = await this.userService.createUser(createUserDto);
      
      // Lấy thông tin user được tạo
      const userData = result.data;
      
      // Tạo JWT token cho người dùng mới đăng ký
      const payload = { sub: userData._id, email: userData.email };
      const token = this.jwtService.sign(payload);
      
      return createApiResponse({
        statusCode: HttpStatus.CREATED,
        data: {
          user: userData,
          token: token,
        },
        message: 'Đăng ký tài khoản thành công',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

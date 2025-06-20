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
    try {
      const user = await this.userService.findByEmail(loginUserDto.email);
      
      if (!user) {
        return createApiResponse({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Tài khoản không tồn tại trong hệ thống',
          data: null,
        });
      }

      const isPasswordMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      
      if (!isPasswordMatch) {
        return createApiResponse({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Mật khẩu không chính xác',
          data: null,
        });
      }

      const payload = { sub: user._id, email: user.email };
      const token = this.jwtService.sign(payload);

      return createApiResponse({
        statusCode: HttpStatus.OK,
        message: 'Đăng nhập thành công',
        data: {
          token: token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
          },
        },
      });
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return createApiResponse({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Lỗi tạo token xác thực',
          data: null,
        });
      }
      
      return createApiResponse({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Lỗi hệ thống, vui lòng thử lại sau',
        data: null,
      });
    }
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

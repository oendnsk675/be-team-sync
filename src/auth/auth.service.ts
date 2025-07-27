import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserRepository } from 'src/user/user.repository';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignInDto } from './dto/signin.dto';
import { SignupResponseDto } from './dto/signup-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async signUp(createAuthDto: CreateUserDto): Promise<SignupResponseDto> {
    const hashedPassword = await this.hashPassword(createAuthDto.password);
    const data = {
      ...createAuthDto,
      password: hashedPassword,
    };

    const user = await this.userRepository.save(data);
    return {
      message: 'Signup successful',
      data: user,
    };
  }

  async signIn(createAuthDto: SignInDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
    });
    console.log(user, createAuthDto);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const userValid = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );

    if (!userValid) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { user_id: user.user_id };
    const data = {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_EXPIRED,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRED,
      }),
    };

    return {
      statusCode: 200,
      message: 'Signin successful',
      data,
    };
  }
}

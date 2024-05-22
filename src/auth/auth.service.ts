import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from './dto/signin-response.dto';

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
    const user = await this.userRepository.getUser(createAuthDto.email);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const userValid = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );
    if (!userValid) {
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id_user: user.user_id };
    const data = {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_EXPIRED,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_REFRESH_EXPIRED,
      }),
    };

    return {
      message: 'Signin successful',
      data,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
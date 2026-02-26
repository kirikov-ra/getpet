import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestCodeDto, VerifyCodeDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Запрос SMS-кода для авторизации' })
  @ApiResponse({ status: 200, description: 'Код успешно отправлен' })
  async sendCode(@Body() dto: RequestCodeDto): Promise<{ message: string }> {
    return this.authService.requestSmsCode(dto.phone);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Верификация кода и получение токена' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  async verifyCode(
    @Body() dto: VerifyCodeDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    return this.authService.verifySmsCode(dto.phone, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение данных текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные профиля' })
  getProfile(@CurrentUser() user: User): User {
    return user;
  }
}

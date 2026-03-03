import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpCache = new Map<string, { code: string; expiry: number }>();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async requestSmsCode(phone: string) {
    await Promise.resolve();
    const code = '1234';
    const expiry = Date.now() + 5 * 60 * 1000;
    this.otpCache.set(phone, { code, expiry });

    this.logger.log(`[SMS MOCK] На номер ${phone} отправлен код: ${code}`);

    return { message: 'Код успешно отправлен' };
  }

  async verifySmsCode(phone: string, code: string) {
    const record = this.otpCache.get(phone);

    if (!record || record.code !== code || record.expiry < Date.now()) {
      throw new BadRequestException('Неверный или просроченный код');
    }

    this.otpCache.delete(phone);

    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      this.logger.log(`Создан новый пользователь с телефоном: ${phone}`);
      user = await this.prisma.user.create({
        data: {
          phone,
        },
      });
    }

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        phone: user.phone,
      },
    };
  }
}

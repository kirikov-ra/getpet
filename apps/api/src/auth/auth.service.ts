import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConsentType } from '@prisma/client';

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

  async verifySmsCode(phone: string, code: string, ip?: string, userAgent?: string) {
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
          consents: {
            create: {
              type: ConsentType.PDN_PROCESSING,
              purpose: 'Регистрация по номеру телефона',
              ip: ip || 'unknown',
              userAgent: userAgent || 'unknown',
            },
          },
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

  async verifyVkLoginStub(vkId: string, name: string, ip?: string, userAgent?: string) {
    this.logger.log(`[VK MOCK] Попытка авторизации с vkId: ${vkId}`);

    let user = await this.prisma.user.findUnique({
      where: { vkId },
    });

    if (!user) {
      this.logger.log(`Создан новый пользователь через VK: ${name}`);
      user = await this.prisma.user.create({
        data: {
          vkId,
          name,
          consents: {
            create: {
              type: ConsentType.PDN_PROCESSING,
              purpose: 'Авторизация через VK ID (Заглушка)',
              ip: ip || 'unknown',
              userAgent: userAgent || 'unknown',
            },
          },
        },
      });
    }

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        vkId: user.vkId,
      },
    };
  }
}

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-totp';
// import * as qrcode from 'qrcode';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class TotpStrategy extends PassportStrategy(Strategy, 'totp') {
//   constructor(private readonly usersService: UsersService) {
//     super({
//       // Your strategy options go here
//     });
//   }

//   async validate(user: any, done: (error: any, key: string | null, period: number | null) => void): Promise<void> {
//     // Implement your validation logic here
//     // Use this.usersService to retrieve user information and keys

//     // Example:
//     const obj = await this.usersService.findKeyForUserId(user.id);
//     if (!obj) {
//       return done(null, null, null);
//     }

//     return done(null, obj.key, obj.period);
//   }

//   async generateQRCode(user: any): Promise<string> {
//     const obj = await this.usersService.findKeyForUserId(user.id);
//     if (!obj) {
//       throw new Error('User key not found');
//     }

//     const encodedKey = base32.encode(obj.key);
//     const otpUrl = `otpauth://totp/${user.email}?secret=${encodedKey}&period=${obj.period || 30}`;
//     const qrCode = await qrcode.toDataURL(otpUrl);

//     return qrCode;
//   }
// }

// passport-config.service.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { speakeasy } from 'speakeasy';
import * as QRCode from 'qrcode'; // Import the qrcode library

@Injectable()
export class GoogleAuthenticatorStrategy extends PassportStrategy(Strategy, 'google-authenticator') {
  constructor() {
    super();
  }

  async validate(token: string, done: (error: any, user?: any, info?: any) => void) {
    const isValid = speakeasy.totp.verify({
      secret: 'YOUR_SECRET_KEY', 
      encoding: 'base32',
      token: token,
    });

    if (isValid) {
      return done(null, true);
    } else {
      return done(null, false);
    }
  } 

  async generateQRCodeURL(user: any): Promise<string> {
    const secret = speakeasy.generateSecret({
      name: 'YourAppName',
    });

    user.secretKey = secret.base32;
    const qrCodeURL = await this.generateQRCodeURLInternal(secret.otpauth_url);

    return qrCodeURL;
  }

  private async generateQRCodeURLInternal(otpauthURL: string): Promise<string> {
    try {
      // Generate QR code and return the URL
      const qrCodeBuffer = await QRCode.toDataURL(otpauthURL);
      return qrCodeBuffer;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }
}

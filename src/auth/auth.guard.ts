// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles/roles.decorator';
import { User } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
     @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

      // 1) Check if token exist, if exist get
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
       // 2) Verify token (no change happens, expired token)
      const payload = await this.jwtService.verifyAsync(token, {
        secret:process.env.JWT_SECRET_KEY,
      });
      
      if (!payload.email || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
     // 3) Check if user exists
      const user = await this.userModel.findOne({email:payload.email})
      if (!user || user._id.toString() !== payload.sub) {
        throw new UnauthorizedException('User not found or token mismatch');
      }

      const userRole = user.role || 'user';
      if (!requiredRoles.includes(userRole.toLowerCase())) {
        throw new UnauthorizedException(`Access denied: Required role(s): ${requiredRoles.join(', ')}`);
      }

      request['user'] = { id: user._id, email: user.email, role: userRole };
      return true;
    } 
    catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
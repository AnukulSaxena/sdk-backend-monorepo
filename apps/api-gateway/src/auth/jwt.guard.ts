import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found.');
    }

    try {
      // In a real scenario, this would use a public key for verification
      // and might call an Auth Service endpoint.
      // For now, a dummy verification.
      // const payload = await this.jwtService.verifyAsync(token, {
      //   secret: process.env.JWT_SECRET, // Make sure JWT_SECRET is consistent with Auth Service
      // });
      // request['user'] = payload; // Attach user payload to request
      console.log(`API Gateway: JWT present for request: ${request.path}`);
      request['user'] = { userId: 'mock-user-id', username: 'mockuser' }; // Mock user for demo
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
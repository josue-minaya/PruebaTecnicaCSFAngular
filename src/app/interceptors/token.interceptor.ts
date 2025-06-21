import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Service/auth.service';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token = localStorage.getItem('token');

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}

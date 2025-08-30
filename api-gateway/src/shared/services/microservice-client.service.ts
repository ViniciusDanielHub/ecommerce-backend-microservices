import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class MicroserviceClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getServiceUrl(serviceName: string): string {
    const services = this.configService.get('services');
    return services[serviceName]?.url || `http://localhost:3001`;
  }

  // GET request
  get<T>(serviceName: string, endpoint: string, headers?: Record<string, string>): Observable<T> {
    const url = `${this.getServiceUrl(serviceName)}${endpoint}`;
    
    return this.httpService.get<T>(url, { headers }).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError(error => {
        console.error(`Error calling ${serviceName}${endpoint}:`, error.message);
        return throwError(() => error);
      }),
    );
  }

  // POST request
  post<T>(
    serviceName: string, 
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Observable<T> {
    const url = `${this.getServiceUrl(serviceName)}${endpoint}`;
    
    return this.httpService.post<T>(url, data, { headers }).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError(error => {
        console.error(`Error calling ${serviceName}${endpoint}:`, error.message);
        return throwError(() => error);
      }),
    );
  }

  // PUT request
  put<T>(
    serviceName: string, 
    endpoint: string, 
    data?: any, 
    headers?: Record<string, string>
  ): Observable<T> {
    const url = `${this.getServiceUrl(serviceName)}${endpoint}`;
    
    return this.httpService.put<T>(url, data, { headers }).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError(error => {
        console.error(`Error calling ${serviceName}${endpoint}:`, error.message);
        return throwError(() => error);
      }),
    );
  }

  // DELETE request
  delete<T>(
    serviceName: string, 
    endpoint: string, 
    headers?: Record<string, string>
  ): Observable<T> {
    const url = `${this.getServiceUrl(serviceName)}${endpoint}`;
    
    return this.httpService.delete<T>(url, { headers }).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError(error => {
        console.error(`Error calling ${serviceName}${endpoint}:`, error.message);
        return throwError(() => error);
      }),
    );
  }
}

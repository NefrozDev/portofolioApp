import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Contact } from '@common/models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactApi {
  private readonly baseUrl = `${environment.apiUrl}/contact`;

  constructor(private readonly http: HttpClient) {}

  sendMessage(payload: Contact): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.baseUrl, payload);
  }
}
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOListeCours} from './DTOListeCours';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private http: HttpClient) {
  }

  public getCours(): Observable<DTOListeCours> {
    return this.http.get<DTOListeCours>(
      'bourse/cours'
    );
  }
}

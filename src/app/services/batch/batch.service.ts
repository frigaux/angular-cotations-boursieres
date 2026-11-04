import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DTOJobInstance} from './dto-job-instance.interface';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  constructor(private http: HttpClient) {
  }

  public chargerDernieresExecutions(): Observable<DTOJobInstance[]> {
    return this.http.get<DTOJobInstance[]>(
      '/bourse/jobs?jobNames=jobMajAbcLibelles,jobMajAbcCotations,jobMajBoursoramaCours,jobConvertirEnValeurCours,jobCalculerMoyennes'
    );
  }
}

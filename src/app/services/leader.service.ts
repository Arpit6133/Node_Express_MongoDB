import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseUrl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  

  constructor(private http: HttpClient,
    private processHTTPMsgService : ProcessHTTPMsgService) {}
    

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leaders')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leaders/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
      .pipe(map(leaders=> leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  putLeader(leader: Leader): Observable<Leader> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Leader>(baseURL + 'leaders/' + leader.id, leader, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

}

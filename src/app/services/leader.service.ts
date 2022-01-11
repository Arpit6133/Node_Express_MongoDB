import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  getFeaturedLeader(): Leader {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  getLeader(): Leader[] {
    return LEADERS;
  }

}

import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  LEADERS:Leader;
  LeaderService: any;

  constructor() { }

  ngOnInit() {
    this.LEADERS = this.LeaderService.getFeaturedLeader();
  }

}

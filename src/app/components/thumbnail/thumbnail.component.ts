import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
})
export class ThumbnailComponent implements OnInit {
  @Input() src: string;
  @Input() isSmall?: boolean;
  newSrc: string;

  constructor() {}

  ngOnInit(): void {
    this.newSrc = environment.rootURL + this.src;
  }
}

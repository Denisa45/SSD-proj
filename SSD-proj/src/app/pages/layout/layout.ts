// layout.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],  // remove RouterLink if not used
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  
  event: Event = {
    id: 0,
    title: '',
    description: '',
    date: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEvent(id).subscribe(res => {
      this.event = res;
    });
  }

  save() {
    this.eventService.updateEvent(this.event.id!, this.event)
      .subscribe(() => alert('Event updated!'));
  }

  delete() {
  this.eventService.deleteEvent(this.event.id!).subscribe(() => {
    alert('Event deleted!');
    this.router.navigate(['/planner']);
  });
}

}

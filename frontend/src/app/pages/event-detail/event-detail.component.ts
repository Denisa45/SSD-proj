import { Component, OnInit } from '@angular/core';
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
export class EventDetailComponent implements OnInit {
  
  event: Event = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Defaults to today "2024-01-01"
  };

  isEditMode = false;

  constructor(
    private eventService: EventService,
    protected router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.eventService.getEvent(Number(id)).subscribe(data => this.event = data);
    }
  }

  save() {
    console.log('🟢 Save button clicked. Data:', this.event);

    if (!this.event.title || !this.event.date) {
      alert('Please fill in Title and Date');
      return;
    }

    const request = this.isEditMode 
      ? this.eventService.updateEvent(this.event.id!, this.event)
      : this.eventService.addEvent(this.event);

    request.subscribe({
      next: (res) => {
        console.log('✅ Success:', res);
        alert('Saved successfully!');
        this.router.navigate(['/planner']);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        alert('Backend rejected the save. Check console.');
      }
    });
  }
  
  delete() {
    if(confirm('Delete this event?')) {
        this.eventService.deleteEvent(this.event.id!).subscribe(() => {
            this.router.navigate(['/planner']);
        });
    }
  }
}
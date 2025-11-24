import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule
  ],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent {

  /** Angular signal for storing backend events */
  events = signal<Event[]>([]);

  /** Temporary model for adding a new event */
  newEvent = signal<Event>({
    title: '',
    description: '',
    date: ''
  });

  /** FullCalendar Options stored as a signal */
  calendarOptions = signal<any>({
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    height: 'auto',
    events: [],      
    selectable: true,
    editable: false,
   
    displayEventTime: false,  // ⬅️ HIDE the “12a”

     eventClick: (info: any) => this.onEventClick(info)
  });

  constructor(private eventService: EventService) {
    this.loadEvents();

    // Sync calendar automatically when events change
    effect(() => {
      this.calendarOptions.update((opts: any) => ({
        ...opts,
        events: this.events().map(e => ({
          id: e.id,
          title: e.title,
          date: e.date
        }))
      }));
    });
  }

  /** Fetch events from backend */
  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.events.set(data);
    });
  }

  /** Add new event to backend + calendar */
 addEvent(title: string, date: string) {

  if (!title || !date) return;

  const eventToSend = {
    title,
    description: '',
    date
  };

  this.eventService.addEvent(eventToSend).subscribe(created => {
    // 1) Update signal array
    this.events.update(list => [...list, created]);

    // 2) Force FullCalendar to re-render by replacing the options object
    this.calendarOptions.set({
      ...this.calendarOptions(),
      events: this.events().map(e => ({
        id: e.id,
        title: e.title,
        date: e.date
      }))
    });
  });
}


  /** Delete event */
  deleteEvent(id: number) {
    this.eventService.deleteEvent(id).subscribe(() => {
      this.events.update(list => list.filter(e => e.id !== id));
    });
  }



onEventClick(info: any) {
  const eventId = info.event.id;

  // Navigate to event detail page
  window.location.href = `/event/${eventId}`;
}





}

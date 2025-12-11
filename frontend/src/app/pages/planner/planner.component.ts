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
    selectable: true,
    editable: false,
    displayEventTime: false,

    // 🟢 LEFT CLICK: Just show the description (Safe)
    eventClick: (info: any) => {
      const desc = info.event.extendedProps.description || '(No description)';
      alert(`📝 Event Details:\n\n${desc}`);
    },

    // 🔴 RIGHT CLICK: Delete the event (Action)
    // 🔴 RIGHT CLICK: Delete the event
    eventDidMount: (info: any) => {
      // 1. Add Tooltip
      if (info.event.extendedProps.description) {
        info.el.setAttribute('title', info.event.extendedProps.description);
      }

      // 2. Listen for Right-Click
      info.el.addEventListener('contextmenu', (e: MouseEvent) => {
        e.preventDefault(); // Now this works!

        if (confirm(`🗑️ Delete "${info.event.title}"?`)) {
          const id = Number(info.event.id);
          this.deleteEvent(id);
        }
      });
    }
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
          date: e.date,
          // 👇 This line passes the description to the calendar
          extendedProps: { description: e.description } 
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
    // 1. Get the description (or a default message)
    const desc = info.event.extendedProps.description || 'No description provided.';

    // 2. Show it in a pop-up
    alert(desc);

    // ❌ We removed the line: window.location.href = ...
    // Now it will NOT navigate to the edit page.
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService, ScheduleItem } from '../../services/schedule.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  // This object will store the data like: scheduleData['Monday']['08:00'] = { subject: 'Math', room: '101' }
  scheduleData: any = {};

  constructor(private scheduleService: ScheduleService) {
    // Initialize empty grid
    this.days.forEach(day => {
      this.scheduleData[day] = {};
      this.times.forEach(time => {
        this.scheduleData[day][time] = { subject: '', room: '' };
      });
    });
  }

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.scheduleService.getSchedule().subscribe(data => {
      // Fill the grid with data from backend
      data.forEach(item => {
        if (this.scheduleData[item.day] && this.scheduleData[item.day][item.startTime]) {
          this.scheduleData[item.day][item.startTime] = { subject: item.subject, room: item.room };
        }
      });
    });
  }

  // Called whenever you type in a box and leave it (blur event)
  saveCell(day: string, time: string) {
    const cell = this.scheduleData[day][time];
    console.log(`Saving ${day} at ${time}:`, cell);
    
    this.scheduleService.saveSlot(day, time, cell.subject, cell.room).subscribe({
      next: () => console.log('Saved!'),
      error: (err) => console.error('Error saving slot', err)
    });
  }
}
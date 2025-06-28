import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  users = [
    { username: 'gamer123', email: 'gamer123@example.com' },
    { username: 'retroFan', email: 'retrofan@example.com' },
    { username: 'admin', email: 'admin@gamerzone.com' }
  ];
}

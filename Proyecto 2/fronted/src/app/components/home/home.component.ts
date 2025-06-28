import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUser = 'yoUsuario';
  games = [
    {
      title: 'Super Mario Bros',
      genre: 'Plataformas',
      developer: 'Nintendo',
      description: 'Un clásico juego de plataformas con Mario y Luigi.',
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.launchbox-app.com%2Ff193dfc4-0c87-4bd9-bbe6-abd25d61d088.jpg&f=1&nofb=1&ipt=50ea671c0040f9d1ae3ffcb12112a02805470de019bbd1b15192369e629316b6',
      reviews: [
        { username: 'gamer123', comment: '¡Uno de los mejores juegos de la historia!' },
        { username: 'retroFan', comment: 'Me encanta el diseño y la música 🎵' }
      ],
      newReview: ''
    },
    {
      title: 'Doom',
      genre: 'Shooter',
      developer: 'id Software',
      description: 'Desata el infierno en este legendario FPS.',
      image: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fgetwallpapers.com%2Fwallpaper%2Ffull%2F7%2F3%2F9%2F48783.jpg&f=1&nofb=1&ipt=e7b92eac01fdbbc5134cab26c8daee0b976c6b8b0b85f0151af151a0688b08d1',
      reviews: [
        { username: 'doomSlayer', comment: 'La acción no se detiene 🔥' },
        { username: 'oldSchool', comment: 'Jugar esto en CRT era épico.' }
      ],
      newReview: ''
    }
  ];
  addReview(game: any) {
    if (game.newReview.trim()) {
      game.reviews.push({ username: this.currentUser, comment: game.newReview });
      game.newReview = '';
    }
  }
}

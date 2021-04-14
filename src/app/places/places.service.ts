import { AuthService } from './../auth/auth.service';
import { Place } from './place.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})
export class PlacesService {

    private _places = new BehaviorSubject<Place[]>(
        [
            new Place('P1', 'Chefchaouen', 'Blue Beauty of North Morocco', 'https://resize-parismatch.lanmedia.fr/f/webp/r/625/img/var/news/storage/images/paris-match/vivre/voyage/chefchaouen-la-ville-instagram-1656667/img-20191019-1422256/27026091-1-fre-FR/IMG-20191019-1422256.jpg', 350, new Date('2021-03-19'), new Date('2021-12-31'), 'abc'),
            new Place('P2', 'Marrakech', 'Famous Moroccan city', 'https://www.challenge.ma/wp-content/uploads/2020/10/ou-dormir-a-marrakech-740x454-1.jpg', 500, new Date('2021-03-22'), new Date('2021-12-31'), 'abc'),
            new Place('P3', 'Casablanca', 'The Heart of Moroccan Economie', 'https://img-4.linternaute.com/8FogTwdPZx-0bxE2Zpy3FtNkEq4=/660x366/smart/137d8bcc5c0f4d26b9db6f4b3401f032/ccmcms-linternaute/14684585.jpg', 300, new Date('2021-04-01'), new Date('2022-12-31'), 'abc'),
            new Place('P4', 'Tangier', 'Combined Moroccan European Style', 'https://lobservateur.info/wp-content/uploads/2020/06/tanger-1280x720.jpg', 400, new Date('2021-03-21'), new Date('2023-04-01'), 'xyz'),
        ]
    );

    get places() {
        return this._places.asObservable();
    }

    constructor(private authService: AuthService) { }

    getPlace(placeId: string) {
        return this.places.pipe(
            take(1),
            map(places => {
                return { ...places.find(p => p.id === placeId) };
            })
        );

    }

    addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
        const newPlace = new Place(Math.random().toString(), title, description, 'https://www.challenge.ma/wp-content/uploads/2020/10/ou-dormir-a-marrakech-740x454-1.jpg', price, dateFrom, dateTo, this.authService.userId);

        return this.places.pipe(take(1), delay(1000), tap(places => {
            this._places.next(places.concat(newPlace));
        }));
    }

    updatePlace(placeId: string, title: string, description: string) {
        return this.places.pipe(take(1), delay(1000), tap(places => {
            const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
            const updatedPlaces = [...places];
            const oldPlace = updatedPlaces[updatedPlaceIndex];
            updatedPlaces[updatedPlaceIndex] = new Place(
                oldPlace.id,
                title,
                description,
                oldPlace.imageUrl,
                oldPlace.price,
                oldPlace.availableFrom,
                oldPlace.availableTo,
                oldPlace.userId);
            this._places.next(updatedPlaces);
        }))
    }
}

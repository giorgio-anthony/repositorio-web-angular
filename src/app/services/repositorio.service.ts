import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Repository } from '../models/repository.model';

@Injectable({
  providedIn: 'root'
})
export class RepositorioService {
  private apiBase = 'https://localhost:54021/api/github';
  private favoritesSubject = new BehaviorSubject<Repository[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  search(repositoryName: string): Observable<Repository[]> {
    const params = new HttpParams().set('repositoryName', repositoryName);
    return this.http.get<Repository[]>(`${this.apiBase}/search`, { params });
  }

  getRelevance(repositoryName: string): Observable<Repository[]> {
    const params = new HttpParams().set('repositoryName', repositoryName);
    return this.http.get<Repository[]>(`${this.apiBase}/relevance`, { params });
  }

  // novo: retorna diretamente a lista de favoritos a partir do endpoint
  getFavorites(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${this.apiBase}/favorites`);
  }

  loadFavorites(): void {
    this.http.get<Repository[]>(`${this.apiBase}/favorites`)
      .subscribe({
        next: list => this.favoritesSubject.next(list),
        error: () => this.favoritesSubject.next([])
      });
  }

  toggleFavorite(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/favorites/${id}`, {})
      .pipe(
        tap(() => {
          this.http.get<Repository[]>(`${this.apiBase}/favorites`)
            .subscribe({
              next: list => this.favoritesSubject.next(list),
              error: () => {}
            });
        })
      );
  }
}
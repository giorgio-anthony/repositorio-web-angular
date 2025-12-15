import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { RepositorioService } from '../../services/repositorio.service';
import { Repository } from '../../models/repository.model';

@Component({
  selector: 'app-repositorios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css']
})
export class RepositoriosComponent implements OnInit, OnDestroy {
  repos: string = '';
  repositorios: Repository[] = [];
  query = '';
  favorites: Repository[] = [];
  private subs = new Subscription();

  constructor(private repositorioService: RepositorioService) {}

  ngOnInit(): void {
    this.repositorioService.loadFavorites();
    this.subs.add(this.repositorioService.favorites$.subscribe(f => this.favorites = f));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buscarRepos(): void {
    if (!this.repos?.trim()) return;

    this.repositorioService.search(this.repos.trim()).subscribe({
      next: res => this.repositorios = res,
      error: () => this.repositorios = []
    });
  }

  // mostra favoritos usando o endpoint /favorites
  showFavorites(): void {
    this.repositorioService.getFavorites().subscribe({
      next: res => {
        this.repositorios = res;
        this.query = '';
        this.repos = 'Favoritos';
      },
      error: () => this.repositorios = []
    });
  }

  showRelevance(): void {
    if (!this.repos?.trim()) return;
    this.repositorioService.getRelevance(this.repos.trim()).subscribe({
      next: res => this.repositorios = res,
      error: () => this.repositorios = []
    });
  }

  isFavorited(repo: Repository): boolean {
    return this.favorites.some(f => f.id === repo.id);
  }

  toggleFavorite(repo: Repository): void {
    this.repositorioService.toggleFavorite(repo.id).subscribe({
      next: () => { /* atualização via favorites$ */ },
      error: () => {}
    });
  }

  clear(): void {
    this.repos = '';
    this.query = '';
    this.repositorios = [];
  }
}
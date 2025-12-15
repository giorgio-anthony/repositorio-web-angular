export interface Repository {
    id: number;
    name: string;
    fullName: string;
    htmlUrl: string;
    description?: string | null;
    stars: number;
    forks: number;
    watchers: number;
    relevanceScore?: number;
    isFavorite: boolean;
}
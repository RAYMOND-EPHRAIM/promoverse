import { apiPost, apiPut, apiDelete } from './api';

interface PostData {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  mediaUrl?: string;
  category?: string;
  verseId?: string;
  locationId?: string;
  scheduledFor?: string;
  draft?: boolean;
}

interface Post extends PostData {
  id: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  starCount: number;
  commentCount: number;
  viewCount: number;
  boostLevel: number;
  boostMultiplier: number;
  boosted: boolean;
  published: boolean;
}

export async function createPost(postData: PostData) {
  return apiPost<Post>('/api/posts', postData);
}

export async function updatePost(id: string, postData: Partial<PostData>) {
  return apiPut<Post>(`/api/posts/${id}`, postData);
}

export async function deletePost(id: string) {
  return apiDelete<{ success: boolean }>(`/api/posts/${id}`);
}

export async function publishPost(id: string) {
  return apiPut<Post>(`/api/posts/${id}/publish`, {});
}

export async function schedulePost(id: string, scheduledFor: string) {
  return apiPut<Post>(`/api/posts/${id}/schedule`, { scheduledFor });
}

export async function getPost(id: string) {
  return apiPost<Post>(`/api/posts/${id}`, {});
}

export async function getPostsByAuthor(authorId: string) {
  return apiPost<Post[]>(`/api/posts/author/${authorId}`, {});
}

export async function getTrendingPosts() {
  return apiPost<Post[]>('/api/posts/trending', {});
}

export async function searchPosts(query: string) {
  return apiPost<Post[]>('/api/posts/search', { query });
} 
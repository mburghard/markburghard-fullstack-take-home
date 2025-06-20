import { MediaItem } from '@/contexts/PortfolioContext';

const API_BASE_URL = 'http://localhost:8000';

export async function uploadFile(
  file: File,
  title: string,
  description: string,
  category: string,
  date?: string
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  if (date) {
    formData.append('date', date);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const data = await response.json();
  
  // Ensure the URL is complete with the API base URL
  return {
    ...data,
    url: `${API_BASE_URL}${data.url}`,
  };
}

export async function savePortfolio(userId: string, items: MediaItem[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/save-portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      items: items.map(item => ({
        id: item.id,
        filename: item.filename,
        media_type: item.media_type,
        title: item.title,
        description: item.description,
        category: item.category,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save portfolio');
  }
}

export async function loadPortfolio(userId: string): Promise<MediaItem[]> {
  const response = await fetch(`${API_BASE_URL}/load-portfolio/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to load portfolio');
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    ...item,
    url: `${API_BASE_URL}${item.url || `/uploads/${item.filename}`}`,
  }));
}

export interface AllContentsDto {
  content_key: number;
  content_title: string;
  introduction?: string;
  category: string[];
  start_at?: string;
  end_at?: string;
  liked: boolean;
  usage: string;
}

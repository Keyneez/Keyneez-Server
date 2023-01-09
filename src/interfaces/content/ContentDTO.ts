export interface ContentDTO {
    content_key: number,
    content_title: string,
    content_link?: string,
    content_img?: string,
    place?: string,
    introduction?: string,
    benefit?: string,
    category: string[],
    start_at?: string,
    end_at?: string,
    liked: boolean,
}
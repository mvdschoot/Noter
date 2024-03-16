export interface NoteDocument {
    id: string,
    user_id: string,
    created_on: number,
    last_modified: number,
    title: string,
    content: string
}
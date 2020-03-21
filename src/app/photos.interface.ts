interface Photo {
    id: string;
    imageUrl: string;
}

export interface Photos extends Array<Photo> {
}

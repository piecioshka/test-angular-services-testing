interface Photo {
    id: string;
    photoUrl: string;
}

export interface Photos extends Array<Photo> {
}

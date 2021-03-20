export interface Video {
    _id: string,
    name: string,
    description: string,
    duration: string,
    uploadDate: String,
    category: {
      _id: string,
      name: string
    },
    isReady: boolean,
    fileDownloadUrl: string,
    hlsUrl: string,
    thumbnailUrl: string,
    likes: number,
    views: number,
    isWatched: boolean,
    questionnaireSubmitted: boolean,
    isFavorite: boolean,
    isLiked: boolean,
    questionnaire: [
      {
        question: string,
        answers: [
          string
        ],
        options: [
          string
        ]
      }
    ]
  }

export interface Videos {
    count: number;
    videos: Video[];
}
export interface FavoriteVideo  {
    title: string;
    addedBy: string;
    addedOn: string;
}

export interface LikedVideo  {
    title: string;
    likedBy: string;
    likedOn: string;
}

export interface WatchedVideo  {
    title: string;
    watchedBy: string;
    watchedOn: string;
}

export interface CompletionTime  {
    title: string;
    watchedBy: string;
    watchedOn: string;
    uploadedOn: string;
}

export interface Task {
  task: string;
  assignedTo: string;
  date: string;
}

export interface TaskCompletionTime {
  task: string;
  assignedTo: string;
  date: string;
  completionTime: number;
}

export interface AttendanceReport {
  count: number;
  reports: [
    {
      date: string;
      user: string;
    }
  ]
}

export interface FavoriteVideoResp {
  count: number;
  reports: FavoriteVideo[]
}

export interface LikedVideoResp {
  count: number;
  reports: LikedVideo[]
}

export interface WatchedVideoResp {
  count: number;
  reports: WatchedVideo[]
}

export interface CompletionTimeResp {
  count: number;
  reports: CompletionTime[]
}

export interface CompletedTaskResp {
  count: number;
  reports: Task[]
}

export interface PendingTaskResp {
  count: number;
  reports: Task[]
}

export interface InProgressTaskResp {
  count: number;
  reports: Task[]
}

export interface TaskCompletionTimeResp {
  count: number;
  reports: TaskCompletionTime[];
}

export interface TotalPresentResp {
  count: number;
  reports: AttendanceReport[]
}

export interface TotalAbsentResp {
  count: number;
  reports: AttendanceReport[]
}

export interface Reports {
  totalVideos?: number;
  totalWatched?: [
    {
      date: string;
      count: number;
    }
  ],
  totalLiked?: [
    {
      date: string;
      count: number;
    }
  ],
  totalFavorites?: [
    {
      date: string;
      count: number;
    }
  ],
  totalTasks?: number;
  totalCompleted?: [
    {
      date: string;
      count: number;
    }
  ],
  totalPending?: [
    {
      date: string;
      count: number;
    }
  ],
  totalInProgress?: [
    {
      date: string;
      count: number;
    }
  ],
  totalUsers?: number;
  totalPresent?: [
    {
      date: string;
      count: number;
    }
  ],
  totalAbsent?: [
    {
      date: string;
      count: number;
    }
  ],
  totalHolidays?: [
    {
      date: string;
      count: number;
    }
  ],
  issueCountByDates: [
    {
      date: string,
      rural: number,
      urban: number
    }
  ],
  issuesAtPSLevel?: number,
  issuesAtJCLevel?: number,
  issuesAtMPDOLevel?: number,
}

export interface IssueReports {
  count: number,
  issuesByEscalationLevel: [
    {
      issueSource: string,
      issueRelatedTo: string,
      raisedOn: string,
      category: string,
      description: string,
      issueType: string,
      verified: string,
      escalatedTo: string,
      escalatedOn: string
    }
  ]
}

export interface ELearningSummary {
  totalWatched: number,
  totalPending: number,
  assessment: [
    {
      boundary: number,
      count: number
    }
  ]
}
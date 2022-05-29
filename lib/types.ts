export interface IPreviewProgram {
  thumb: string
  title: string
  authorKaid: string
  created: string
  authorNickname: string
  sumVotesIncremented: number
  spinoffCount: number
  url: string
  key: string
  flaggedByUser: boolean
  translatedTitle: string
}

export interface IProgram {
  creatorProfile: {
    avatarSrc: string
    nickname: string
  }
  scratchpad: {
    height: number
    width: number
    id: number
    revision: {
      code: string
    }
    spinoffCount: number
    sumVotesIncremented: number
    title: string
    type: string
    userAuthoredContentType: string
    url: string
  }
}

export interface IProfile {
  bio: string
  id: string
  joined: string
  nickname: string
  points: number
  username: string
}
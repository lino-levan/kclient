import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { IPreviewProgram, IProfile } from '../../lib/types'
import { ProgramPreview } from '../../components/ProgramPreview'
import Image from 'next/image'

const Profiles: NextPage<{programs: IPreviewProgram[], profile: IProfile, avatar: string}> = (props) => {
  const programs = props.programs
  const profile = props.profile
  const avatar = props.avatar

  console.log(avatar)

  return (
    <div>
      <Head>
        <title>KClient</title>
        <meta name="description" content="The ultimate program viewer for khanacademy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 text-slate-500">
        <div className="flex flex-col items-center gap-10 py-10 mb-8 pb-4 rounded border-b border-slate-300">
          <div className="flex items-center justify-center gap-10">
            <Image src={"https://cdn.kastatic.org"+avatar} alt={`${profile.username}'s Avatar`} width={100} height={100}></Image>
            <h1 className="text-4xl">{profile.nickname}</h1>
            <h1 className="bg-blue-600 text-white px-4 py-2 rounded">{profile.points} Points</h1>
          </div>
          <p className="text-xl">@{profile.username} - {profile.bio}</p>
        </div>
        <div className="flex flex-wrap gap-10 justify-center">
         {
           programs.map(ProgramPreview)
         }
       </div>
      </main>
    </div>
  )
}

export default Profiles

export const getServerSideProps: GetServerSideProps = async (context) => {
  const kaid = context.params?.kaid

  if(!kaid) return { props: {} }

  const programsRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/projectsAuthoredByUser?lang=en", {
    "body": `{\"operationName\":\"projectsAuthoredByUser\",\"query\":\"query projectsAuthoredByUser($kaid: String, $pageInfo: ListProgramsPageInfo, $sort: ListProgramSortOrder) {\\n  user(kaid: $kaid) {\\n    id\\n    programs(pageInfo: $pageInfo, sort: $sort) {\\n      complete\\n      cursor\\n      programs {\\n        id\\n        key\\n        authorKaid\\n        authorNickname\\n        displayableSpinoffCount\\n        imagePath\\n        sumVotesIncremented\\n        translatedTitle: title\\n        url\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\",\"variables\":{\"kaid\":\"${kaid}\",\"sort\":\"TOP\",\"pageInfo\":{\"cursor\":\"\",\"itemsPerPage\":40}}}`,
    "method": "POST",
  });
  const programs = await programsRaw.json()

  const profileRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?lang=en&_=240216-1303-57997d38f9f4_1708363143557", {
    "body": `{\"operationName\":\"getFullUserProfile\",\"variables\":{\"kaid\":\"${kaid}\"},\"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isFormalTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(\\n      name: \\\"can_send_moderator_messages\\\"\\n      scope: GLOBAL\\n    )\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    includesKmapDistrictOwnedData\\n    includesK4dDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    hasAccessToAIGuideTeacher\\n    hasAccessToAIGuideDistrictAdmin\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    region\\n    userDistrictInfos {\\n      id\\n      isKAD\\n      district {\\n        id\\n        region\\n        __typename\\n      }\\n      __typename\\n    }\\n    schoolAffiliation {\\n      id\\n      location\\n      __typename\\n    }\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}\"}`,
    "method": "POST",
  });
  const profile = await profileRaw.json()

  const avatarRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/avatarDataForProfile?lang=en&_=240216-1303-57997d38f9f4_1708363144446", {
    "body": `{\"operationName\":\"avatarDataForProfile\",\"variables\":{\"kaid\":\"${kaid}\"},\"query\":\"query avatarDataForProfile($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}`,
    "method": "POST",
  });
  const avatar = await avatarRaw.json()

  console.log(profile.data.user)

  return {
    props: {
      programs: programs.data.user.programs.programs,
      profile: profile.data.user,
      avatar: avatar.data.user.avatar.imageSrc
    },
  }
}

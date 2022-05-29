import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { IPreviewProgram, IProfile } from '../../lib/types'
import { ProgramPreview } from '../../components/ProgramPreview'
import Image from 'next/image'

const Profiles: NextPage<{programs: IPreviewProgram[], profile: IProfile, avatar: string}> = (props) => {
  const programs = props.programs
  const profile = props.profile
  const avatar = props.avatar

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
            <Image src={avatar} alt={`${profile.username}'s Avatar`} width={100} height={100}></Image>
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

  const programsRaw = await fetch(`https://www.khanacademy.org/api/internal/user/scratchpads?casing=camel&kaid=${kaid}&sort=1&page=0&limit=40&lang=en`)
  const programs = await programsRaw.json()

  console.log(kaid)

  const profileRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?curriculum=us-cc&lang=en&_=220526-1420-af63889336b9_1653787676824", {
    "body": `{\"operationName\":\"getFullUserProfile\",\"variables\":{\"kaid\":\"${kaid}\"},\"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n\"}`,
    "method": "POST",
  })
  const profile = await profileRaw.json()

  const avatarRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/avatarDataForProfile?curriculum=us-cc&lang=en&_=220526-1420-af63889336b9_1653789239247", {
    "body": `{\"operationName\":\"avatarDataForProfile\",\"variables\":{\"kaid\":\"${kaid}\"},\"query\":\"query avatarDataForProfile($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}`,
    "method": "POST",
    "mode": "cors"
  })
  const avatar = await avatarRaw.json()

  return {
    props: {
      programs: programs.scratchpads,
      profile: profile.data.user,
      avatar: avatar.data.user.avatar.imageSrc
    },
  }
}

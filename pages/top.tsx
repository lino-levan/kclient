import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { NavProgramLists } from '../components/NavProgramLists'

import { ProgramPreview } from '../components/ProgramPreview'
import { IPreviewProgram } from '../lib/types'


const Home: NextPage<{top: IPreviewProgram[]}> = (props) => {
  const top = props.top

  return (
    <div>
      <Head>
        <title>KClient</title>
        <meta name="description" content="The ultimate program viewer for khanacademy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 text-slate-500">
        <NavProgramLists />
        <div className="flex flex-wrap gap-10 justify-center">
         {
           top.map(ProgramPreview)
         }
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const topRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/hotlist?lang=en", {
    "body": "{\"operationName\":\"hotlist\",\"query\":\"query hotlist($curationNodeId: String, $onlyOfficialProjectSpinoffs: Boolean!, $sort: ListProgramSortOrder, $pageInfo: ListProgramsPageInfo) {\\n  listTopPrograms(\\n    curationNodeId: $curationNodeId\\n    onlyOfficialProjectSpinoffs: $onlyOfficialProjectSpinoffs\\n    sort: $sort\\n    pageInfo: $pageInfo\\n  ) {\\n    complete\\n    cursor\\n    programs {\\n      id\\n      key\\n      authorKaid\\n      authorNickname\\n      displayableSpinoffCount\\n      imagePath\\n      sumVotesIncremented\\n      translatedTitle: title\\n      url\\n      __typename\\n    }\\n    __typename\\n  }\\n}\",\"variables\":{\"curationNodeId\":\"xffde7c31\",\"onlyOfficialProjectSpinoffs\":false,\"sort\":\"UPVOTE\",\"pageInfo\":{\"itemsPerPage\":30,\"cursor\":\"\"}}}",
    "method": "POST",
  });
  const top = await topRaw.json()

  return {
    props: {
      top: top.data.listTopPrograms.programs
    },
  }
}

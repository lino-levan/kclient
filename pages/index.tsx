import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { ProgramPreview } from '../components/ProgramPreview'
import { NavProgramLists } from '../components/NavProgramLists'
import { IPreviewProgram } from '../lib/types'


const Home: NextPage<{hot: IPreviewProgram[]}> = (props) => {
  const hot = props.hot

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
           hot.map(ProgramPreview)
         }
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const topRaw = await fetch(`https://www.khanacademy.org/api/internal/scratchpads/top?casing=camel&sort=3&page=0&limit=30&lang=en`)
  const hot = await topRaw.json()

  return {
    props: {
      hot: hot.scratchpads
    },
  }
}

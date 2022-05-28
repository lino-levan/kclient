import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { NavProgramLists } from '../components/NavProgramLists'

import { ProgramPreview } from '../components/ProgramPreview'
import { IPreviewProgram } from '../lib/types'


const Home: NextPage<{new: IPreviewProgram[]}> = (props) => {
  const newPosts = props.new

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
           newPosts.map(ProgramPreview)
         }
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const newRaw = await fetch(`https://www.khanacademy.org/api/internal/scratchpads/top?casing=camel&sort=2&page=0&limit=30&topic_id=xffde7c31&lang=en`)
  const newPosts = await newRaw.json()

  return {
    props: {
      new: newPosts.scratchpads
    },
  }
}
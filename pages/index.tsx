import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

interface ITop {
  cursor: string
  scratchpads: {
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
  }[]
}

const Home: NextPage<{top: ITop}> = (props) => {
  const top = props.top

  return (
    <div>
      <Head>
        <title>KClient</title>
        <meta name="description" content="The ultimate program viewer for khanacademy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 text-slate-500">
        <div className="py-10 text-red-500 flex flex-col items-center">
          <h1 className="text-xl">NOTE: A majority of the following programs will not work due to kdraw.js being outdated. I am working on this.</h1>
          <h1>Below are tested examples</h1>
          <div className='flex flex-col items-center'>
            <Link href="/programs/5046811102855168">Bobbing Pin (HTML)</Link>
            <Link href="/programs/6350256594272256">Dinner (PJS)</Link>
          </div>
          <h1>Below are examples of programs failing</h1>
          <div className='flex flex-col items-center'>
            <Link href="/programs/5649495811997696">Amogus (PJS)</Link>
            <Link href="/programs/4608875592990720">Park Bench (PJS)</Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-10 justify-center">
         {
           top.scratchpads.map((scratchpad) => { 
            return (
              <div key={scratchpad.key} className="w-52">
                <Link href={`/programs/${scratchpad.url.split("/").pop()}`} target="_blank" rel="noreferrer">
                  <div>
                    <div className="flex justify-center items-center outline outline-1 outline-slate-300 w-52 h-52">
                      <Image src={`https://www.khanacademy.org${scratchpad.thumb}`} alt={scratchpad.title} width={208} height={208}/>
                    </div>
                    <p className="w-52 h-7 text-xl text-blue-500 overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 cursor-pointer hover:underline">{scratchpad.title}</p>
                  </div>
                </Link>
                <a href={`https://www.khanacademy.org/profile/${scratchpad.authorKaid}`}><p className="w-52 h-6 text-blue-500 overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 cursor-pointer hover:underline">{scratchpad.authorNickname}</p></a>
                <p className="w-52 h-6 overflow-hidden text-ellipsis whitespace-nowrap">{scratchpad.sumVotesIncremented} Votes · {scratchpad.spinoffCount} Spin-Offs</p>
              </div>
            )
           })
         }
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const topRaw = await fetch(`https://www.khanacademy.org/api/internal/scratchpads/top?casing=camel&sort=3&page=0&limit=30&lang=en`)
  const top = await topRaw.json()

  return {
    props: {
      top
    },
  }
}
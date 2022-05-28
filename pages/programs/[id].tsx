import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Editor from "@monaco-editor/react"
import { useEffect, useRef, useState } from 'react'

import { IProgram } from '../../lib/types'

const Home: NextPage<{program?: IProgram}> = (props) => {
  const program = props.program

  const iframe = useRef(null)
  const [code, setCode] = useState(program?.scratchpad.revision.code || "")

  useEffect(() => {
    if(iframe && iframe.current) {
      let page = ""

      if(program?.scratchpad.userAuthoredContentType === "webpage") {
        page = code
      }

      if(program?.scratchpad.userAuthoredContentType === "pjs") {
        page = `
        <html>
          <head>
          </head>
          <body style="margin:0px;padding:0px;overflow:none;">
            <canvas id="kdraw" width="${program.scratchpad.width}" height="${program.scratchpad.height}"></canvas>
            <script src="https://cdn.jsdelivr.net/gh/lino-levan/kdraw.js@main/kdraw.js" type="text/javascript"></script>
            <script>${code}</script>
          </body>
        </html>
        `
      }

      let iframeDoc = iframe.current as HTMLIFrameElement
      iframeDoc.srcdoc = page
    }
  }, [code, program])

  if(!program) return <div>Error</div>

  return (
    <div>
      <Head>
        <title>KClient</title>
        <meta name="description" content="The ultimate program viewer for khanacademy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-10 text-slate-500 flex flex-col gap-10">
       <h1 className="text-4xl text-center text-slate-800">{program.scratchpad.title}</h1>
       <div className="grid grid-flow-col outline outline-1 outline-slate-300" style={{height:program.scratchpad.height}}>
        <Editor
            height={program.scratchpad.height}
            defaultLanguage={program.scratchpad.userAuthoredContentType === 'webpage' ? 'html' : 'javascript'}
            defaultValue={program.scratchpad.revision.code}
            loading=""
            options={{minimap: {enabled: false}}}
            onChange={(newValue) => setCode(newValue || "")}
          />
        <div>
          <iframe ref={iframe} title={program.scratchpad.title} width={program.scratchpad.width} height={program.scratchpad.height}></iframe>
        </div>
       </div>
       <div className="flex justify-center gap-10">
         <p className="bg-blue-600 text-white px-4 py-2 rounded">{program.scratchpad.sumVotesIncremented} Votes</p>
         <a className="bg-blue-600 text-white px-4 py-2 rounded" href={program.scratchpad.url} target="_blank" rel="noreferrer">View on Khanacademy</a>
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id

  if(!id) return { props: {} }

  const programRaw = await fetch(`https://www.khanacademy.org/api/internal/show_scratchpad?scratchpad_id=${id}&casing=camel&topic_slug=computer-programming&lang=en`)
  const program = await programRaw.json()

  return {
    props: {
      program
    },
  }
}
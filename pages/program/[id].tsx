import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import Editor from "@monaco-editor/react"
import { useEffect, useRef, useState } from 'react'

import { IProgram } from '../../lib/types'

const Home: NextPage<{program?: IProgram}> = (props) => {
  const program = props.program

  const iframe = useRef(null)
  const [code, setCode] = useState(program?.revision.code || "")

  useEffect(() => {
    if(iframe && iframe.current) {
      let page = ""

      console.log(program?.userAuthoredContentType)

      if(program?.userAuthoredContentType === "WEBPAGE") {
        page = code
      }

      if(program?.userAuthoredContentType === "PJS") {
        page = `
        <html>
          <head>
          </head>
          <body style="margin:0px;padding:0px;overflow:none;">
            <canvas id="kdraw" width="${program.width}" height="${program.height}"></canvas>
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
       <h1 className="text-4xl text-center text-slate-800">{program.title}</h1>
       <div className="grid grid-flow-col outline outline-1 outline-slate-300" style={{height:program.height}}>
        <Editor
            height={program.height}
            defaultLanguage={program.userAuthoredContentType === 'webpage' ? 'html' : 'javascript'}
            defaultValue={program.revision.code}
            loading=""
            options={{minimap: {enabled: false}}}
            onChange={(newValue) => setCode(newValue || "")}
          />
        <div>
          <iframe ref={iframe} title={program.title} width={Math.max(program.width, program.height)} height={program.height}></iframe>
        </div>
       </div>
       <div className="flex justify-center gap-10">
         <p className="bg-blue-600 text-white px-4 py-2 rounded">{program.sumVotesIncremented} Votes</p>
         <a className="bg-blue-600 text-white px-4 py-2 rounded" href={program.url} target="_blank" rel="noreferrer">View on Khanacademy</a>
       </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id

  if(!id) return { props: {} }

  const programRaw = await fetch("https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en", {
    "body": `{\"operationName\":\"programQuery\",\"query\":\"query programQuery($programId: String!) {\\n  programById(id: $programId) {\\n    byChild\\n    category\\n    created\\n    creatorProfile: author {\\n      id\\n      nickname\\n      profileRoot\\n      profile {\\n        accessLevel\\n        __typename\\n      }\\n      __typename\\n    }\\n    deleted\\n    description\\n    spinoffCount: displayableSpinoffCount\\n    docsUrlPath\\n    flags\\n    flaggedBy: flaggedByKaids\\n    flaggedByUser: isFlaggedByCurrentUser\\n    height\\n    hideFromHotlist\\n    id\\n    imagePath\\n    isProjectOrFork: originIsProject\\n    isOwner\\n    kaid: authorKaid\\n    key\\n    newUrlPath\\n    originScratchpad: originProgram {\\n      deleted\\n      translatedTitle\\n      url\\n      __typename\\n    }\\n    restrictPosting\\n    revision: latestRevision {\\n      id\\n      code\\n      configVersion\\n      created\\n      editorType\\n      folds\\n      __typename\\n    }\\n    slug\\n    sumVotesIncremented\\n    title\\n    topic: parentCurationNode {\\n      id\\n      nodeSlug: slug\\n      relativeUrl\\n      slug\\n      translatedTitle\\n      __typename\\n    }\\n    translatedTitle\\n    url\\n    userAuthoredContentType\\n    upVoted\\n    width\\n    __typename\\n  }\\n}\",\"variables\":{\"programId\":\"${id}\"}}`,
    "method": "POST",
  });
  const program = await programRaw.json()

  console.log(program.data.programById)

  return {
    props: {
      program: program.data.programById
    },
  }
}

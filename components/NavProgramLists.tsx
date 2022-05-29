import Link from "next/link";

export function NavProgramLists() {
  return (
    <>
      <div className='flex justify-end gap-5 pb-5 border-b border-slate-300'>
        <Link href="/">Hot</Link>
        <Link href="/new">New</Link>
        <Link href="/top">Top</Link>
      </div>
      <div className="py-10 text-red-500 flex flex-col items-center">
        <h1 className="text-xl">NOTE: A majority of the following programs will not work due to kdraw.js being outdated. I am working on this.</h1>
        <h1>Below are tested examples</h1>
        <div className='flex flex-col items-center'>
          <Link href="/program/5046811102855168">Bobbing Pin (HTML)</Link>
          <Link href="/program/6350256594272256">Dinner (PJS)</Link>
        </div>
        <h1>Below are examples of programs failing</h1>
        <div className='flex flex-col items-center'>
          <Link href="/program/5649495811997696">Amogus (PJS)</Link>
          <Link href="/program/4608875592990720">Park Bench (PJS)</Link>
        </div>
      </div>
    </>
  )
}
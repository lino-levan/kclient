import Link from "next/link";
import Image from "next/image";

export function ProgramPreview(scratchpad: { thumb: string; title: string; authorKaid: string; created: string; authorNickname: string; sumVotesIncremented: number; spinoffCount: number; url: string; key: string; flaggedByUser: boolean; translatedTitle: string }): JSX.Element {
  return <div key={scratchpad.key} className="w-52">
    <Link href={`/programs/${scratchpad.url.split("/").pop()}`} target="_blank" rel="noreferrer">
      <div>
        <div className="flex justify-center items-center outline outline-1 outline-slate-300 w-52 h-52">
          <Image src={`https://www.khanacademy.org${scratchpad.thumb}`} alt={scratchpad.title} width={208} height={208} />
        </div>
        <p className="w-52 h-7 text-xl text-blue-500 overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 cursor-pointer hover:underline">{scratchpad.title}</p>
      </div>
    </Link>
    <a href={`https://www.khanacademy.org/profile/${scratchpad.authorKaid}`}><p className="w-52 h-6 text-blue-500 overflow-hidden text-ellipsis whitespace-nowrap underline-offset-4 cursor-pointer hover:underline">{scratchpad.authorNickname}</p></a>
    <p className="w-52 h-6 overflow-hidden text-ellipsis whitespace-nowrap">{scratchpad.sumVotesIncremented} Votes · {scratchpad.spinoffCount} Spin-Offs</p>
  </div>
}
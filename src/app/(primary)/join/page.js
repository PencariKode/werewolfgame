import Gamecode from "@/app/component/Gamecode";
import { frijole } from "@/app/ui/fonts";


export default function JoinPage() {


  return (
    <>
      <div className="mincomp flexcenter h-[75vh] flex-col pt-14 mb-20">
        <h1 className={`${frijole.className} text-3xl text-rose-700`}>W<b className="font-normal text-red-600">O</b>LFMAN</h1>
        <Gamecode />
      </div>
    </>
  );
}
import { TriviaGameOver } from "../types/types"

export const EndGame = (props: {
    state: TriviaGameOver, 
    startGame: () => void, 
    srcLogoPhoto: string, 
    srcCharacter: string, 
    textResult: 'FAILED' | 'GREAT JOB',
    textSummary: string

  }) => {

return <div className={`h-screen tracking-wider`}>
  <div className={`${props.state.score ? 'bg-green-600' : 'bg-red-600' }`}>
    <nav className="p-4">
      <ul className="grid grid-cols-1 gap-2 items-center ">
        <li className="justify-self-end"><img src={props.srcLogoPhoto} width={436/8} height={429/8} alt="" /></li>
      </ul>
    </nav>
  </div>
  <div className="grid gap-2 mt-8 place-items-center p-2 tracking-wider text-center [text-wrap:balance]">
    <h3 className={`text-6xl ${props.state.score ? 'text-green-600' : 'text-red-600' } font-extrabold`}>{props.textResult}</h3>
    <p className="text-2xl text-gray-800">{props.textSummary}</p>
    <p className="text-gray-800 text-">{props.state.summaryAnswered}</p>
    <img src={props.srcCharacter} className=" place-self-center p-2" alt="" />
    <button className="p-4 text-blue-50 bg-blue-950 rounded-2xl text-2xl font-extrabold tracking-wider" onClick={props.startGame}>Start New Game</button>
  </div>
</div>
}
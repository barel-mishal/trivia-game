import { useState } from "react";
import { TriviaGame, TriviaGameInterface, TriviaGameOver, TriviaPlaying } from "./types/types";
import getQuiz from "./services/quiz";
import decodeHtml from "./util/decodeHtml";
import TimerQuestion from "./components/TimerQuestion";
import { getColorMatchingDifficulty, getDifficulty, numberOfQuestions } from "./util/quizHelpers";
import { EndGame } from "./components/EndGame";
import { FailedCharacter, Logo, SplashLogo, SuccessCharacter } from "./components/Assets";

export default function App() {
  const [state, setState] = useState<TriviaGameInterface>({
    state: TriviaGame.start,
  });
  const startGame = () => {
    setState({state: TriviaGame.loading});
    getQuiz().then((data) => {
      const newState: TriviaGameInterface = { 
        state: TriviaGame.playing, 
        currentQuestion: 0, 
        questions: data
      };
      setState(newState);  
    }).catch((error) => {
      console.log(error);
    });
  };
  const endGame = () => {
    const stateNow = {...state} as TriviaPlaying;
    const answersRightScore = stateNow.questions.reduce((prev, curr) =>  {
      const isRight = Number(curr.answered === curr.correct_answer);
      prev += isRight;
      return prev
    },0)
    const newState: TriviaGameOver = { 
      state: TriviaGame.stop, 
      score: (answersRightScore / stateNow.questions.length) >= 0.8,
      summaryAnswered: `Correct: ${answersRightScore} Incorrect: ${stateNow.questions.length - answersRightScore}`
    };
    setState(newState);
  };
  const nextQuestion = () => {
    const newState = {...state as TriviaPlaying}
    newState.currentQuestion += 1
    if (newState.currentQuestion > newState.questions.length - 1) return endGame();
    setState(newState);  
  };
  const checkAnswer = (answered: string) => {
    const newState = {...state as TriviaPlaying}
    const newCurrentQuestion = newState.questions[newState.currentQuestion];
    newCurrentQuestion.answered = answered;
    setState(newState);
    nextQuestion();
  };
  return (
    <div className="">
      {
      state.state === TriviaGame.start && <div className="h-screen  grid grid-rows-[1fr,90px] gap-2 p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 from-0% to-blue-800 to-70%">
        <img src={SplashLogo} className=" place-self-center p-2" width={297} height={459} alt="" />
        <button className="p-2 bg-blue-50 text-blue-950 rounded-2xl text-3xl font-extrabold tracking-wider" onClick={startGame}>Let’s Play</button>
      </div>
      }
      {
      state.state === TriviaGame.playing && <div className="grid">
        <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 from-0% to-blue-800 to-70%">
          <nav className="p-4">
            <ul className="grid grid-cols-[auto,auto,1fr] gap-2 items-center">
              <li className="text-white no-underline font-bold text-2xl">Question</li>
              <li className="text-white no-underline font-bold text-2xl">{numberOfQuestions(state)}</li>
              <li className="justify-self-end"><img src={Logo} width={436/8} height={429/8} alt="" /></li>
            </ul>
          </nav>
        </div>
        <div className="grid p-4 gap-7">
          <p className="text-slate-800 text-sm">Level: <span className={`font-bold ${getColorMatchingDifficulty(state)}`}>{getDifficulty(state)?.toUpperCase()}</span></p>
          <h2 className="text-3xl font-normal tracking-wide text-slate-700">{decodeHtml(state.questions && state.questions[state.currentQuestion].question)}</h2>
          <div className="flex flex-col gap-4">
            {state.questions && state.questions[state.currentQuestion].answers.map((answer, index) => (
              <button className="min-h-[80px] rounded-2xl text-2xl font-bold text-slate-700 bg-slate-200 text-left p-4" key={index} onClick={() => checkAnswer(answer)}>{decodeHtml(answer)}</button>
            ))}
          </div>
            <TimerQuestion time={state.questions.length * 5} endGame={endGame} />
        </div>
      </div>
      }
      {state.state === TriviaGame.stop && (
        state.score ? <EndGame 
          state={state} 
          startGame={startGame} 
          srcLogoPhoto={Logo}
          srcCharacter={SuccessCharacter}
          textResult="GREAT JOB"
          textSummary="You answered more then 80% questions correctly"
        />
        : <EndGame 
          state={state} 
          startGame={startGame} 
          srcLogoPhoto={Logo}
          srcCharacter={FailedCharacter}
          textResult="FAILED"
          textSummary="You answered less then 80% questions correctly"      
        />
      )}
      {
        state.state === TriviaGame.loading && <>
          <div className={`h-screen tracking-wider`}>
            <div className={`bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 from-0% to-blue-800 to-70%`}>
              <nav className="p-4">
                <ul className="grid grid-cols-1 gap-2 items-center ">
                  <li className="justify-self-end"><img src={Logo} width={436/8} height={429/8} alt="" /></li>
                </ul>
              </nav>
            </div>
            <div className="grid gap-2 mt-8 place-items-center p-2 tracking-wider text-center [text-wrap:balance]">
              <h3 className={`text-6xl text-gray-800' } font-extrabold`}>Loading</h3>
              <p className="text-2xl text-gray-600">Please wait...</p>
            </div>
          </div>
        </>  
      }
      
    </div>
  )
}




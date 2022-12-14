import { createSignal, createEffect, For, Show, on } from 'solid-js';
import { Button, Counter } from '@app/comps';
import { Question, Screen } from '@app/utils/types';
import { getRandomQuestion } from '@app/utils/functions';

import { useState } from '@app/context';

const SECONDS = 8;
const MAX_QUESTIONS = 10;

const Questions = () => {
  const [counterReset, setCounterReset] = createSignal(true);
  const [nro, setNro] = createSignal(1);
  const [answer, setAnswer] = createSignal<number | null>(null);
  const { state, actions: { setPoints, setScreen } } = useState();

  const [question, setQuestion] = createSignal<Question>(getRandomQuestion(state.heroes));
  let questionTimer: NodeJS.Timeout;

  createEffect(on(nro, () => {
    clearTimeout(questionTimer);
    questionTimer = setTimeout(() => handleAnswer(5), SECONDS * 1000);
  }));

  const handleNextQuestion = () => {
    if (answer() === null) return;
    if (question().correctIndex === answer()) {
      setPoints(prev => prev + 1);
    }
    setAnswer(null);
    setCounterReset(true);
    setNro(prev => prev + 1);
    setQuestion(getRandomQuestion(state.heroes));
  };
  const handleAnswer = (index: number) => {
    if (answer() !== null) return;
    setAnswer(index);
  };
  const handleFinish = () => {
    if (question().correctIndex === answer()) {
      setPoints(prev => prev + 1);
    }
    setScreen(Screen.Final);
  };

  return (
    <main>
      <div class="flex flex-col px-2">
        <div class="mt-4 md:mt-20 flex justify-center">
          <div class="flex flex-col max-w-md flex-1">
            <div class="self-stretch mb-6">
              <Counter seconds={SECONDS} reset={counterReset()} setReset={setCounterReset} />
            </div>
            <div class="rounded-3 overflow-hidden self-center">
              <img src={question().imgUrl} />
            </div>
            <p class="text-sm mt-8">{`${nro()} of ${MAX_QUESTIONS}`}</p>
            <h3 class="text-2xl font-500 mb-4">
              {question().question}
            </h3>
            <div class="pt-1 pb-4 md:pb-10" />

            <div class="flex flex-col gap-3 items-stretch">
              <For each={question().options}>{(option, index) => (
                <Button
                  // eslint-disable-next-line solid/reactivity
                  onClick={[handleAnswer, index()]}
                  variant={
                    (question().correctIndex === answer() && answer() === index()) ||
                      (answer() !== null && index() === question().correctIndex)
                      ? 'success'
                      : answer() !== null && answer() === index()
                        ? 'error'
                        : 'primary'
                  }
                >
                  <p>{option}</p>
                </Button>
              )}</For>
            </div>

            <Show when={answer() !== null}>
              <div class="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    if (nro() === MAX_QUESTIONS) {
                      handleFinish();
                      return;
                    }
                    handleNextQuestion();
                  }}
                >
                  {nro() === MAX_QUESTIONS ? 'Finish' : 'Next'}
                </Button>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Questions;

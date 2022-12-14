import { Switch, Match, createEffect, createResource } from 'solid-js';
import { Screen } from '@app/utils/types';
import Home from './Home';
import Questions from './Questions';
import EndScreen from './EndScreen';

import { useState } from '@app/context';
import { getHeroData } from '@app/utils/functions';

const Main = () => {
  const [heroes] = createResource(getHeroData);
  const { state, actions: { setHeroes } } = useState();

  createEffect(() => {
    if (heroes() !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setHeroes(heroes()!);
    }
  });

  return (
    <div class="container mx-a color-blue-1 relative">
      <Switch>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Match when={Boolean(heroes()) && heroes()!.length > 0 && !heroes.loading}>
          <Switch>
            <Match when={state.screen() === Screen.Home}>
              <Home />
            </Match>
            <Match when={state.screen() === Screen.Questions}>
              <Questions />
            </Match>
            <Match when={state.screen() === Screen.Final}>
              <EndScreen />
            </Match>
          </Switch>
        </Match>
        <Match when={heroes.loading}>
          <div class="flex justify-center items-center mt-16">
            <div class="i-mdi-robot mr-2 text-3xl" />
            <p class="text-center">Stealing data from valve...</p>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default Main;

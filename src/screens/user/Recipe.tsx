import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import recipeService from "../../services/recipe-service";
import { Button, Steps, Typography } from "antd";
import Timer from "../../components/Timer/Timer";
const { Title, Text } = Typography;

const Recipe = () => {
  const { recipeID } = useParams<any>();
  const [recipe, setRecipe] = useState<any>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const RecipeService = new recipeService();
  const [timers, setTimers] = useState<any>([]);

  const handleTick = (time: number, name: string | number) => {
    console.log(name);
    /*     const timersCopy = [...timers];
    for (let i = 0; i < timersCopy.length; i++) {
      if (timersCopy[i].name === name) timersCopy[i].time = timersCopy[i].time - 1;
    }
    setTimers((oldTimers: any) => timersCopy); */
    console.log(timers);
    console.log("LOG");
  };

  const stopTimer = (name: string) => {
    const timersCopy = [...timers];
    console.log(timersCopy);
    for (let i = 0; i < timersCopy.length; i++) {
      if (timersCopy[i].name === name) timersCopy[i].running = false;
    }
    console.log(timersCopy);
    setTimers(timersCopy);
  };

  const startTimer = (name: string) => {
    const timersCopy = [...timers];
    console.log(timersCopy);
    for (let i = 0; i < timersCopy.length; i++) {
      if (timersCopy[i].name === name) timersCopy[i].running = true;
    }
    console.log(timersCopy);
    setTimers(timersCopy);
  };

  useEffect(() => {
    RecipeService.getRecipe(recipeID)
      .then((data) => setRecipe(data))
      .catch((err) => console.log(err));
  }, []);

  const start = () => {
    setStarted(true);
  };

  const previous = () => {
    currentStep > 0 ? setCurrentStep(currentStep - 1) : setStarted(false);
  };

  const timer = () => {
    if (!timers.some((timer: any) => timer.name === recipe.steps[currentStep].name)) {
      setTimers((oldTimers: any) => [
        ...oldTimers,
        { name: recipe.steps[currentStep].name, time: recipe.steps[currentStep].time, running: true },
      ]);
    }
    console.log(timers);
  };

  const next = () => {
    currentStep < recipe.steps.length - 1 ? setCurrentStep(currentStep + 1) : setFinished(true);
  };

  const handleFinish = () => {
    console.log("TIMER FINISHED!");
  };

  return recipe ? (
    <>
      {!started ? (
        <div>
          <Title>{recipe.title}</Title>
          {recipe.ingredients.map((ingredient: any, i: number) => (
            <div key={i}>
              {ingredient.name}
              {ingredient.quantity}
              {ingredient.unit}
            </div>
          ))}
          <Button onClick={start}>Start the recipe</Button>
        </div>
      ) : (
        <>
          <Title>{recipe.steps[currentStep].name}</Title>
          <Text>{recipe.steps[currentStep].description}</Text>
          <Button onClick={previous}>-</Button>
          <Button onClick={next}>+</Button>
          {recipe.steps[currentStep].timer ? <Button onClick={timer}>Start the timer</Button> : null}
        </>
      )}
      {timers.map((timer: any, i: number) => (
        <div key={i}>
          <Timer
            time={timer.time}
            tickRate={1000}
            onTick={handleTick}
            onFinish={handleFinish}
            running={timer.running}
            name={timer.name}
          ></Timer>
          <Button onClick={() => stopTimer(timer.name)}>Stop Timer</Button>
          <Button onClick={() => startTimer(timer.name)}>Start Timer</Button>
        </div>
      ))}
    </>
  ) : (
    <div>loading</div>
  );
};

export default Recipe;

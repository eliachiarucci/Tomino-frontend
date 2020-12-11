import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import recipeService from "../../services/recipe-service";
import { Card, Avatar, Button, Steps, Typography, Tooltip, Rate, Divider } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Timer from "../../components/Timer/Timer";
import Tomino from "../../components/Tomino/Tomino";
import styles from "./user.module.css";
import Clock from "../../images/clock.jpg";
import FlexContainer from "flexcontainer-react";
import useSound from "use-sound";
import timeFormatter from "../../helpers/timeFormatter";
const alarm = require("../../sounds/timerSound.mp3");
const { Meta } = Card;
const { Title, Text } = Typography;

const Recipe = () => {
  const { recipeID } = useParams<any>();
  const [recipe, setRecipe] = useState<any>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const RecipeService = new recipeService();
  const [timers, setTimers] = useState<any>([]);
  const [play] = useSound(alarm);

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
      .then(data => setRecipe(data))
      .catch(err => console.log(err));
  }, []);

  const start = () => {
    setStarted(true);
  };

  const previous = () => {
    currentStep > 0 ? setCurrentStep(currentStep - 1) : setStarted(false);
  };

  const next = () => {
    currentStep < recipe.steps.length - 1 ? setCurrentStep(currentStep + 1) : setFinished(true);
  };

  const timer = () => {
    if (!timers.some((timer: any) => timer.name === recipe.steps[currentStep].name)) {
      setTimers((oldTimers: any) => [
        ...oldTimers,
        { name: recipe.steps[currentStep].name, time: recipe.steps[currentStep].time, running: true }
      ]);
    }
    console.log(timers);
  };

  const handleFinish = () => {
    play();
  };

  const getPreparationTime = (time: number) => {
    return new timeFormatter().getFullString(time);
  };

  return recipe ? (
    <FlexContainer type="horizontal" justifyContent="center" alignItems="center" height="100%" width="100%">
      <Tomino />
      {!started ? (
        <FlexContainer className={styles.fullRecipeCard} type="vertical" alignItems="flex-start" gap={20} padding={50} width="800px">
          <Title>{recipe.title}</Title>
          <Title level={3}>{recipe.description}</Title>
          <Title level={3}>Calories: {recipe.calories}</Title>
          <div>
            <Title level={3}>Conservation Times:</Title>
            {recipe.conservationtimes.map((conservation: any, i: number) => (
              <div key={i}>
                -{conservation.conservationtime} {conservation.storagelocation}
              </div>
            ))}
          </div>
          <div>
            <Title level={3}>Ingredients:</Title>
            {recipe.ingredients.map((ingredient: any, i: number) => (
              <div key={i}>
                -<strong>{ingredient.name}</strong> {ingredient.quantity} {ingredient.unit}
              </div>
            ))}
          </div>
          <div>
            <Title level={3}>Steps:</Title>
            {recipe.steps.map((step: any, i: number) => (
              <div key={i}>
                -<strong>{step.name}</strong>
              </div>
            ))}
          </div>
          <Button type="primary" onClick={start}>
            Start the recipe
          </Button>
        </FlexContainer>
      ) : (
        <>
          {!finished ? (
            <div className={styles.stepCard}>
              <Title>{recipe.steps[currentStep].name}</Title>
              <Text>{recipe.steps[currentStep].description}</Text>
              <div className={styles.buttonsWrapper}>
                <Button type="primary" onClick={previous}>
                  Previous
                </Button>
                <Button type="primary" onClick={next}>
                  Next
                </Button>
              </div>
              {recipe.steps[currentStep].timer ? (
                <div>
                  <div>
                    <br />
                    <Text>Timer:</Text>
                    <Tooltip title="There is a timer for this step, it will start when you proceed to the next section, or when you click the button">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <Text>Duration: {getPreparationTime(recipe.steps[currentStep].time)} </Text>
                  <Button type="primary" onClick={timer}>
                    Start the timer
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <FlexContainer className={styles.stepCard} type="vertical" alignItems="center" padding={40}>
              <Title>CONGRATULATIONS!</Title>
              <Text>You completed this recipe, tell the author how good it is.</Text>
              <Rate />
              <Divider />
              <Link to="/home">
                <Button type="primary">Go back home</Button>
              </Link>
            </FlexContainer>
          )}
        </>
      )}

      <FlexContainer type="vertical" className={styles.timerCardWrapper} gap={30}>
        {timers.map((timer: any, i: number) => (
          <div key={i}>
            <Card
              className={styles.timerCard}
              actions={[
                <Button onClick={() => stopTimer(timer.name)}>Stop</Button>,
                <Button onClick={() => startTimer(timer.name)}>Start</Button>
              ]}
            >
              <Meta avatar={<Avatar src={Clock} />} title={timer.name} />
              <Timer time={timer.time} tickRate={1000} onFinish={handleFinish} running={timer.running} name={timer.name} />
            </Card>
          </div>
        ))}
      </FlexContainer>
    </FlexContainer>
  ) : (
    <div>loading</div>
  );
};

export default Recipe;

const handler = async (event) => {
    console.log({event: JSON.stringify(event)})
    if (
      event.request.privateChallengeParameters.answer ==
      event.request.challengeAnswer
    ) {
      event.response.answerCorrect = true;
    } else {
      event.response.answerCorrect = false;
    }
  
    return event;
  };
  
  export { handler };
  
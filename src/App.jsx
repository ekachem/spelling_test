import React, { useState, useEffect } from 'react';

// Correct shuffle function
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export default function App() {
  const [words, setWords] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Load words initially
  useEffect(() => {
    loadWords();
  }, []);

  // Timer with correct closure handling
  useEffect(() => {
    if (words.length === 0 || score !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          // ✅ Use latest answers to calculate score
          const correct = answers.reduce((acc, ans, idx) => {
            return acc + (ans.trim().toLowerCase() === words[idx].trim().toLowerCase() ? 1 : 0);
          }, 0);
          setScore(correct);
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [words, answers, score]);

  const loadWords = () => {
    fetch(`${import.meta.env.BASE_URL}words.json`)
      .then((res) => res.json())
      .then((data) => {
        const selected = shuffle([...data]).slice(0, 15);
        setWords(selected);
        setAnswers(Array(15).fill(''));
        setCurrent(0);
        setScore(null);
        setIsTimeUp(false);
        setTimeLeft(60);
      });
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
  };

  const checkAnswers = (answersArray) => {
    let correct = 0;
    answersArray.forEach((ans, idx) => {
      if (ans.trim().toLowerCase() === words[idx].trim().toLowerCase()) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const correct = checkAnswers(answers);
    setScore(correct);
  };

  const restart = () => {
    loadWords();
  };

  if (words.length === 0) return <p>Loading words...</p>;

  return (
    <div className="container">
      <h1>Spelling Test</h1>
      <p>⏰ Time Left: {timeLeft} seconds</p>

      {score === null ? (
        <>
          <div className="question">
            <p>Word {current + 1} of {words.length}</p>
            <button onClick={() => speak(words[current])}>🔊 Hear Word</button>
            <input
              type="text"
              value={answers[current]}
              onChange={handleChange}
              placeholder="Type the word you heard"
            />
            <div className="nav">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))}>◀ Prev</button>
              <button onClick={() => setCurrent((c) => Math.min(words.length - 1, c + 1))}>Next ▶</button>
            </div>
          </div>

          <div className="submit">
            <button onClick={handleSubmit}>✅ Submit Test</button>
          </div>
        </>
      ) : (
        <>
          <p className="result">{isTimeUp ? '⏱️ Time is up!' : '✅ Test Submitted!'}</p>
          <p>You got {score} out of {words.length} correct.</p>
          <button onClick={restart}>🔄 Try Again</button>
        </>
      )}
    </div>
  );
}


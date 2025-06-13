import React, { useState } from 'react';

const words = ['apple', 'banana', 'grapes', 'orange', 'peach'];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(words.length).fill(''));
  const [score, setScore] = useState(null);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    let correct = 0;
    answers.forEach((ans, idx) => {
      if (ans.trim().toLowerCase() === words[idx]) {
        correct++;
      }
    });
    setScore(correct);
  };

  return (
    <div className="container">
      <h1>Spelling Test</h1>

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
        <button onClick={checkAnswers}>✅ Submit Test</button>
        {score !== null && (
          <p className="result">You got {score} out of {words.length} correct!</p>
        )}
      </div>
    </div>
  );
}


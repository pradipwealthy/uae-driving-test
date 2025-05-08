import React, { useState, useEffect } from 'react';
import questionData from '../questions.json';
import './Quiz.css';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved progress from localStorage on component mount
    useEffect(() => {
        setQuestions(questionData.questions);

        try {
            const savedAnswers = localStorage.getItem('quizAnswers');
            const savedResults = localStorage.getItem('quizResults');

            if (savedAnswers) {
                setUserAnswers(JSON.parse(savedAnswers));
            }

            if (savedResults) {
                setShowResults(JSON.parse(savedResults));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            // Clear potentially corrupted localStorage data
            localStorage.removeItem('quizAnswers');
            localStorage.removeItem('quizResults');
        }

        setIsLoaded(true);
    }, []);

    // Save progress to localStorage whenever answers or results change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
            localStorage.setItem('quizResults', JSON.stringify(showResults));
        }
    }, [userAnswers, showResults, isLoaded]);

    const handleOptionSelect = (questionIndex, selectedOption) => {
        const updatedAnswers = { ...userAnswers };
        updatedAnswers[questionIndex] = selectedOption;
        setUserAnswers(updatedAnswers);

        const updatedResults = { ...showResults };
        updatedResults[questionIndex] = true;
        setShowResults(updatedResults);
    };

    const handleClearAnswer = (questionIndex) => {
        const updatedAnswers = { ...userAnswers };
        delete updatedAnswers[questionIndex];
        setUserAnswers(updatedAnswers);

        const updatedResults = { ...showResults };
        delete updatedResults[questionIndex];
        setShowResults(updatedResults);
    };

    const isCorrectAnswer = (questionIndex, option) => {
        if (!showResults[questionIndex]) return null;

        const correctAnswer = questions[questionIndex].correct_answer;
        return option === correctAnswer;
    };

    const resetAllAnswers = () => {
        setUserAnswers({});
        setShowResults({});
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('quizResults');
    };

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1>Quiz App</h1>
                <button className="reset-button" onClick={resetAllAnswers}>
                    Reset All Answers
                </button>
            </div>
            {questions.map((q, questionIndex) => (
                <div key={questionIndex} className="question-card">
                    <h3><span className="question-number">Question {questionIndex + 1}:</span> {q.question}</h3>
                    <div className="options-container">
                        {Object.entries(q.options[0]).map(([option, text]) => (
                            <div
                                key={option}
                                className={`option ${userAnswers[questionIndex] === option
                                    ? isCorrectAnswer(questionIndex, option)
                                        ? 'correct'
                                        : 'incorrect'
                                    : ''
                                    }`}
                                onClick={() => handleOptionSelect(questionIndex, option)}
                            >
                                <span className="option-letter">{option}</span>
                                <span className="option-text">{text}</span>
                            </div>
                        ))}
                    </div>
                    {showResults[questionIndex] && (
                        <div className="result-container">
                            <div className="result-message">
                                {isCorrectAnswer(questionIndex, userAnswers[questionIndex])
                                    ? <span className="correct-message">Correct!</span>
                                    : <span className="incorrect-message">
                                        Incorrect! The correct answer is {q.correct_answer}.
                                    </span>
                                }
                            </div>
                            <button
                                className="clear-button"
                                onClick={() => handleClearAnswer(questionIndex)}
                            >
                                Clear Answer
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Quiz; 
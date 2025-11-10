
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { INTEREST_QUESTIONS, INTEREST_PROFILES_DETAIL } from '../constants';
import { Jurusan, InterestResult } from '../types';
import { useAppContext } from '../context/AppContext';
import { getRecommendations } from '../services/recommendationService';
import ScoreVisualizer from '../components/ScoreVisualizer';

type Answers = { [key: number]: number };
type Scores = { [key:string]: number };

const TesMinatPage: React.FC = () => {
    const { setInterestResult, setRecommendedMajors } = useAppContext();
    const [step, setStep] = useState<'intro' | 'test' | 'result'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    
    const [currentScores, setCurrentScores] = useState<Scores>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    const [finalResult, setFinalResult] = useState<InterestResult | null>(null);
    const [majors, setMajors] = useState<Jurusan[]>([]);

    const calculateCurrentScores = (currentAnswers: Answers): Scores => {
        const scores: Scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        INTEREST_QUESTIONS.forEach(q => {
            if(currentAnswers[q.id]) {
                scores[q.type] += currentAnswers[q.id];
            }
        });
        return scores;
    };

    const handleAnswer = (questionId: number, value: number) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);
        setCurrentScores(calculateCurrentScores(newAnswers));
    };

    const handleNext = () => {
        if (currentQuestionIndex < INTEREST_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        const scores = calculateCurrentScores(answers);
        const topScoreKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const result = INTEREST_PROFILES_DETAIL[topScoreKey];
        
        const recommendations = getRecommendations(scores);
        setMajors(recommendations.recommendedMajors);
        
        setFinalResult(result);
        setInterestResult(result);
        setRecommendedMajors(recommendations.recommendedMajors);
        
        setStep('result');
    };
    
    const currentQuestion = INTEREST_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / INTEREST_QUESTIONS.length) * 100;

    const Intro = () => (
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-2xl mx-auto animate-boing-in">
            <h1 className="text-3xl font-bold mb-4">Tes Minat Bakat</h1>
            <p className="text-gray-600 mb-8">Jawab {INTEREST_QUESTIONS.length} pertanyaan singkat ini untuk memahami diri Anda lebih dalam. Jawablah sejujurnya sesuai kata hati untuk hasil yang akurat. Tidak ada jawaban benar atau salah.</p>
            <button onClick={() => setStep('test')} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-teal-700 transition-colors shadow-lg">
                Mulai Tes
            </button>
        </div>
    );

    const Test = () => (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto animate-boing-in">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mb-4">Pertanyaan {currentQuestionIndex + 1} dari {INTEREST_QUESTIONS.length}</p>
            
            {currentQuestion.imageUrl && (
              <img 
                src={currentQuestion.imageUrl} 
                alt={currentQuestion.text}
                className="w-full h-48 object-cover rounded-xl mb-6 shadow-md"
              />
            )}

            <h2 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.text}</h2>
            <div className="flex justify-around items-center">
                <span className="text-sm text-gray-500">Tidak Sesuai</span>
                {[1, 2, 3, 4, 5].map(value => (
                    <button
                        key={value}
                        onClick={() => handleAnswer(currentQuestion.id, value)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${answers[currentQuestion.id] === value ? 'bg-teal-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-teal-200'}`}
                    >
                        {value}
                    </button>
                ))}
                <span className="text-sm text-gray-500">Sangat Sesuai</span>
            </div>
            
            <ScoreVisualizer scores={currentScores} />

            <div className="text-center mt-8">
                <button onClick={handleNext} disabled={!answers[currentQuestion.id]} className="bg-stone-500 text-white font-bold py-2 px-6 rounded-full hover:bg-stone-600 disabled:bg-gray-400 shadow">
                    {currentQuestionIndex < INTEREST_QUESTIONS.length - 1 ? 'Lanjut' : 'Lihat Hasil'}
                </button>
            </div>
        </div>
    );
    
    const Result = () => {
       if(!finalResult) return null;

       return (
           <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl max-w-4xl mx-auto animate-boing-in">
                <img src={finalResult.imageUrl} alt={finalResult.profile} className="w-full h-48 md:h-64 object-cover rounded-xl mb-6" />
                <div className="text-center">
                    <h2 className="text-xl text-gray-500">Profil Minat Utama Anda:</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-teal-600 my-2">{finalResult.profile}</h1>
                </div>

                <p className="text-gray-700 text-base md:text-lg text-center max-w-3xl mx-auto mt-4 mb-8">{finalResult.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                    <div className="bg-green-50 p-4 border-l-4 border-green-400 rounded-lg">
                        <h3 className="text-lg font-bold text-green-800 mb-2">Kekuatan Anda:</h3>
                        <ul className="space-y-1 list-disc list-inside text-green-700">
                            {finalResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div className="bg-red-50 p-4 border-l-4 border-red-400 rounded-lg">
                        <h3 className="text-lg font-bold text-red-800 mb-2">Area Pengembangan:</h3>
                        <ul className="space-y-1 list-disc list-inside text-red-700">
                            {finalResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="my-8">
                    <h3 className="text-2xl font-bold text-center mb-4">Rekomendasi Jurusan untuk Anda</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {majors.map(jurusan => (
                            <div key={jurusan.id} className="bg-gray-100 p-4 rounded-lg border border-gray-200 hover:bg-teal-50 transition-colors">
                                <h4 className="font-bold text-teal-700">{jurusan.nama}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2">{jurusan.deskripsi}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-200 text-center space-y-4 md:space-y-0 md:flex md:justify-center md:space-x-4">
                    <Link to="/jurusan" className="w-full md:w-auto inline-block bg-gray-700 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-800 transition-colors">
                        Eksplorasi Semua Jurusan
                    </Link>
                     <Link to="/konsultasi" className="w-full md:w-auto inline-block bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-teal-700 transition-colors">
                        Lanjut Konsultasi AI
                    </Link>
                </div>
            </div>
       )
    };

    return (
        <div>
            {step === 'intro' && <Intro />}
            {step === 'test' && <Test />}
            {step === 'result' && <Result />}
        </div>
    );
};

export default TesMinatPage;
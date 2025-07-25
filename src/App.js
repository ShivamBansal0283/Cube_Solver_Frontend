
// import React, { useState } from 'react';

// // Import the newly created components and services
// import SolverForm from './components/SolverForm';
// import SolutionDisplay from './components/SolutionDisplay';
// import { solveWithBackend } from './services/api';

// // --- Main App Component ---

// export default function App() {
//     // State management for the application
//     const [scramble, setScramble] = useState('');
//     const [solution, setSolution] = useState('Solution will appear here...');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [copied, setCopied] = useState(false);

//     // Function to handle the "Solve" button click
//     const handleSolve = async () => {
//         setIsLoading(true);
//         setError('');
//         setSolution('');
//         setCopied(false);

//         try {
//             // Call the solve function from our api.js service
//             const result = await solveWithBackend(scramble);
//             setSolution(result);
//         } catch (err) {
//             setError(err.message);
//             setSolution('');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // Function to handle copying the solution to the clipboard
//     const handleCopy = () => {
//         if (solution) {
//             navigator.clipboard.writeText(solution).then(() => {
//                 setCopied(true);
//                 setTimeout(() => setCopied(false), 2000);
//             });
//         }
//     };

//     // Render the main application layout
//     return (
//         <div style={{ background: 'linear-gradient(to bottom right, #111827, #000000)' }} className="text-light min-vh-100 py-5">
//             <div className="container p-4 p-md-5" style={{ maxWidth: '800px' }}>
//                 <header className="text-center mb-5">
//                     <h1 className="display-4 fw-bolder text-white">
//                         Rubik's Cube Solver
//                     </h1>
//                     <p className="fs-5 text-white-50 mt-3">React Frontend with C# Backend</p>
//                 </header>

//                 <main className="p-4 p-md-5 rounded-4 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
//                     {/* Use the SolverForm component */}
//                     <SolverForm
//                         scramble={scramble}
//                         setScramble={setScramble}
//                         onSolve={handleSolve}
//                         isLoading={isLoading}
//                     />

//                     {/* Use the SolutionDisplay component */}
//                     <SolutionDisplay
//                         isLoading={isLoading}
//                         error={error}
//                         solution={solution}
//                         onCopy={handleCopy}
//                         copied={copied}
//                     />
//                 </main>

//                 <footer className="text-center mt-5 text-white-50">
//                     <p>A full-stack implementation of a two-phase cube solver.</p>
//                 </footer>
//             </div>
//         </div>
//     );
// }















import React, { useState } from 'react';
import { solveWithBackend } from './services/api';
import Cube3D from './components/Cube3D'; // Import the new 3D component

export default function App() {
    const [scramble, setScramble] = useState("R U R' U'");
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // New state for animation
    const [animationSequence, setAnimationSequence] = useState([]);
    const [statusText, setStatusText] = useState('Enter a scramble and click Solve.');

    const handleSolve = async () => {
        setIsLoading(true);
        setError('');
        setSolution('');
        setCopied(false);
        setStatusText('Scrambling cube...');

        // Animate the scramble first
        const scrambleMoves = scramble.split(' ').filter(m => m);
        setAnimationSequence(scrambleMoves);

        // Wait for scramble animation to finish before calling the solver
        await new Promise(res => setTimeout(res, scrambleMoves.length * 400 + 500));

        try {
            setStatusText('Sending to solver...');
            const result = await solveWithBackend(scramble);
            setSolution(result);
            setStatusText('Animating solution...');

            // Animate the solution
            const solutionMoves = result.split(' ').filter(m => m);
            setAnimationSequence(solutionMoves);

            // Set a timeout to update the status after the solution animation finishes
            setTimeout(() => {
                setStatusText('Solved! Enter a new scramble.');
                setIsLoading(false);
            }, solutionMoves.length * 400 + 500);

        } catch (err) {
            setError(err.message);
            setStatusText('An error occurred.');
            setIsLoading(false); // Stop loading on error
        }
    };

    const handleCopy = () => {
        if (solution) {
            navigator.clipboard.writeText(solution).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <div style={{ background: 'linear-gradient(to bottom right, #111827, #000000)' }} className="text-light min-vh-100 py-5">
            <div className="container p-4 p-md-5" style={{ maxWidth: '800px' }}>
                <header className="text-center mb-5">
                    <h1 className="display-4 fw-bolder text-white">3D Rubik's Cube Solver</h1>
                    <p className="fs-5 text-white-50 mt-3">React Frontend with C# Backend</p>
                </header>

                {/* 3D Cube Component */}
                <div style={{ height: '400px', cursor: 'grab' }}>
                    <Cube3D animationSequence={animationSequence} />
                </div>

                <main className="p-4 p-md-5 rounded-4 shadow-lg mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)' }}>
                    {/* Status Display */}
                    <div className="text-center text-info mb-4 fs-5" style={{ minHeight: '2rem' }}>{statusText}</div>

                    {/* Input Form */}
                    <div className="mb-4">
                        <label htmlFor="scramble" className="form-label fs-5 fw-semibold mb-3">Scramble Sequence</label>
                        <input
                            type="text"
                            id="scramble"
                            value={scramble}
                            onChange={(e) => setScramble(e.target.value)}
                            className="form-control form-control-lg bg-dark text-white border-secondary"
                            placeholder="e.g., R U R' U'"
                            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                        />
                    </div>
                    <div className="d-grid gap-2 col-8 mx-auto my-4">
                        <button onClick={handleSolve} disabled={isLoading} className="btn btn-primary btn-lg fw-bold">
                            {isLoading ? 'Animating...' : 'Scramble & Solve'}
                        </button>
                    </div>

                    {/* Solution Display */}
                    <div className={`mt-4 p-4 rounded-3 d-flex align-items-center justify-content-center text-center ${error ? 'bg-danger bg-opacity-25' : ''}`} style={{ minHeight: '80px' }}>
                        {error && <p className="fs-5 font-monospace text-danger m-0">{error}</p>}
                        {solution && <p className="fs-4 font-monospace text-info text-break m-0">{solution}</p>}
                    </div>
                    {solution && !error && !isLoading && (
                        <div className="text-center mt-4">
                            <button onClick={handleCopy} className={`btn ${copied ? 'btn-success' : 'btn-outline-info'} rounded-pill px-4`}>
                                {copied ? 'Copied!' : 'Copy Solution'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

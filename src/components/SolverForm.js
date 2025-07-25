
// import React from 'react';

// const SolverForm = ({ scramble, setScramble, onSolve, isLoading }) => {
//     return (
//         <>
//             <div className="mb-4">
//                 <label htmlFor="scramble" className="form-label fs-5 fw-semibold mb-3">Enter Scramble Sequence</label>
//                 <input
//                     type="text"
//                     id="scramble"
//                     value={scramble}
//                     onChange={(e) => setScramble(e.target.value)}
//                     className="form-control form-control-lg bg-dark text-white border-secondary"
//                     placeholder="e.g., R U R' U' F2 B D2"
//                 />
//                 <div className="form-text mt-2">Use standard move notation (U, R', F2, etc.).</div>
//             </div>

//             <div className="d-grid gap-2 col-6 mx-auto my-4">
//                 <button
//                     onClick={onSolve}
//                     disabled={isLoading}
//                     className="btn btn-primary btn-lg"
//                 >
//                     {isLoading ? 'Solving...' : 'Solve Cube'}
//                 </button>
//             </div>
//         </>
//     );
// };

// export default SolverForm;






import React from 'react';

const SolverForm = ({ scramble, setScramble, onSolve, isLoading }) => {
    return (
        <>
            <div className="mb-4">
                <label htmlFor="scramble" className="form-label fs-5 fw-semibold mb-3">Enter Scramble Sequence</label>
                <input
                    type="text"
                    id="scramble"
                    value={scramble}
                    onChange={(e) => setScramble(e.target.value)}
                    className="form-control form-control-lg bg-dark text-white border-secondary"
                    placeholder="e.g., R U R' U' F2 B D2"
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                />
                <div className="form-text mt-2 text-white-50">Use standard move notation (U, R', F2, etc.).</div>
            </div>

            <div className="d-grid gap-2 col-8 mx-auto my-4">
                <button
                    onClick={onSolve}
                    disabled={isLoading}
                    className="btn btn-primary btn-lg fw-bold"
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Solving...
                        </>
                    ) : 'Solve Cube'}
                </button>
            </div>
        </>
    );
};

export default SolverForm;
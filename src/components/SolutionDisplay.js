
// import React from 'react';

// const SolutionDisplay = ({ isLoading, error, solution, onCopy, copied }) => {
//     const containerClasses = `mt-4 p-4 rounded border d-flex align-items-center justify-content-center`;
//     const errorClasses = 'bg-danger bg-opacity-10 border-danger';
//     const defaultClasses = 'bg-secondary bg-opacity-10 border-secondary';

//     return (
//         <>
//             <div className={`${containerClasses} ${error ? errorClasses : defaultClasses}`} style={{ minHeight: '100px' }}>
//                 {isLoading && (
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 )}
//                 {error && <p className="fs-5 font-monospace text-danger m-0">{error}</p>}
//                 {solution && <p className="fs-4 font-monospace text-light text-break m-0">{solution}</p>}
//             </div>

//             {solution && !error && !isLoading && (
//                 <div className="text-center mt-4">
//                     <button
//                         onClick={onCopy}
//                         className="btn btn-outline-light rounded-pill"
//                     >
//                         {copied ? 'Copied!' : 'Copy Solution'}
//                     </button>
//                 </div>
//             )}
//         </>
//     );
// };

// export default SolutionDisplay;





import React from 'react';

const SolutionDisplay = ({ isLoading, error, solution, onCopy, copied }) => {
    const containerClasses = `mt-4 p-4 rounded-3 d-flex align-items-center justify-content-center text-center`;
    const errorClasses = 'bg-danger bg-opacity-25 border border-danger-subtle';
    const defaultClasses = 'bg-black bg-opacity-25 border border-secondary';

    return (
        <>
            <div className={`${containerClasses} ${error ? errorClasses : defaultClasses}`} style={{ minHeight: '120px' }}>
                {isLoading && (
                    <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}
                {error && <p className="fs-5 font-monospace text-danger m-0">{error}</p>}
                {solution && <p className="fs-4 font-monospace text-info text-break m-0">{solution}</p>}
            </div>

            {solution && !error && !isLoading && (
                <div className="text-center mt-4">
                    <button
                        onClick={onCopy}
                        className={`btn ${copied ? 'btn-success' : 'btn-outline-info'} rounded-pill px-4`}
                    >
                        {copied ? 'Copied!' : 'Copy Solution'}
                    </button>
                </div>
            )}
        </>
    );
};

export default SolutionDisplay;
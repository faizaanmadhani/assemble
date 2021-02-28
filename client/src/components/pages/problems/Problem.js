import React, { useEffect, useState } from 'react'

export default function Problem(props) {
    const [problem, setProblem] = useState(props.problem);
    const [problemNumber, setProblemNumber] = useState(props.problemNumber)
    const [problemComponent, setProblemComponent] = useState();

    const setupQuestion = () => {
        setProblemComponent(
            <div style={{padding:"20px", margin:"20px",}}>
                <h1 style={{marginBottom:"10px",}}>Problem {problemNumber}</h1>
                <p>{problem}</p>
            </div>
        )
    }

    useEffect(() => {
        setupQuestion()
    }, [problemComponent])

    return (
        <div>
            {problemComponent}            
        </div>
    )
}

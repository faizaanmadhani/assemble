import React, { useEffect, useState } from 'react'

export default function Problem(props) {
    const [solution, setSolution] = useState(props.solution);
    const [solutionNumber, setSolutionNumber] = useState(props.solutionNumber);
    const [solutionComponent, setSolutionComponent] = useState();

    const setupSolution = () => {
        setSolutionComponent(
            <div style={{padding:"20px", margin:"20px",}}>
                <h1 style={{marginBottom:"10px",}}>Solution {solutionNumber}</h1>
                <p>{solution}</p>
            </div>
        )
    }

    useEffect(() => {
        setupSolution()
    }, [solutionComponent])

    return (
        <div>
            {solutionComponent}            
        </div>
    )
}
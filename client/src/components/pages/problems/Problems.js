import React, {useState, useEffect} from 'react'
import Problem from './Problem'
import Solution from './Solution'

export default function Problems(props) {
    const [wantSolutions, setWantSolutions] = useState(props.wantSolutions)
    const [problems, setProblems] = useState(props.problems)
    const [solutions, setSolutions] = useState(props.solutions)

    const [problemsArray, setProblemArray] = useState([])
    const [problemsSolutionsArray, setProblemsSolutionArray] = useState([])

    const getProblems = () => {
        if(problemsArray.length == 0) {
            for(let i = 0; i < problems.length; ++i) {
                let problem = (
                    <Problem problem={problems[i]} problemNumber={i + 1} />
                )
                let solution = (
                    <Solution solution={problems[i]} solutionNumber={i + 1} />
                )
    
                problemsArray.push(problem);
                problemsSolutionsArray.push([problem, solution])
            }
        }
    }

    const checkIfNeedSolutions = () => wantSolutions ? problemsSolutionsArray : problemsArray

    useEffect(() => {
        getProblems();
        console.log("Hello")
    }, [problemsArray])

    return (
        <div>
            {checkIfNeedSolutions()}
        </div>
    )
}
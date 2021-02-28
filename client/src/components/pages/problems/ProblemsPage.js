import React from 'react'
import Problems from './Problems'

export default function ProblemsPage(props) {
    return (
        <div>
            <Problems wantSolutions={false} problems={["Problem 1", "Problem 2", "Problem 3"]} solutions={["Solution 1", "Solution 2", "Solution 3"]} />
        </div>
    )
}

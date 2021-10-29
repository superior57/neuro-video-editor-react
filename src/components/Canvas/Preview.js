import { Paper } from "@mui/material";
import React from "react";

export default function Preview({
    className,
    data
}) {
    return (
        <Paper className={className + " py-3 px-4"} square elevation={1} >
            {
                data.map(({ type, value }, index) => (
                    <React.Fragment key={'previw-text-' + index}>{
                        type === "title" ? <h3 className={`${ data[index - 1]?.type !== type ? 'mt-3' : '' }`} >{ value }</h3> : <h5>{ value }</h5>
                    }</React.Fragment>
                ))
            }
        </Paper>
    )
}
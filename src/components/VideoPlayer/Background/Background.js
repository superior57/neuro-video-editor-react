import { makeStyles } from "@mui/styles"


const useStyles = makeStyles(theme => ({
    root: {
        position: "absoute",
        top: 0,
        left: 0
    }
}))

export default function Background({
    width = "100%"
}) {
    const classes = useStyles();
    return (
        <div
            width={ width }
            height={ width * (9 / 16) }
            className={classes.root}
        >
            <img src="/img/default.png" width="100%" height="100%" alt="video background" />
        </div>
    )
}
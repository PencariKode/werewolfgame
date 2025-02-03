
export default function ProgressBar(props) {
    return (
        <div style={
            {
                'minWidth': (props.wdt ? props.wdt : '87') + '%',
                width: (props.wdt ? props.wdt : '87') + '%',
                maxWidth: (props.wdt ? props.wdt : '87') + '%'
            }
        } className={`h-5 bg-red-800 rounded-full`}>
            <div style={
                {
                    width: `${props.percentage}%`
                }
            } className={`h-full bg-teal-600 rounded-full `}></div>
        </div>
    );
}
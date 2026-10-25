const MinusIcon = ({
    size = 16, 
    color = 'currentColor',
    ...props
}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height="2" viewBox={`0 0 ${size} 2`} fill="none" {...props}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1H17H1Z" fill={color}/>
            <path d="M1 1H17" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}

export default MinusIcon;
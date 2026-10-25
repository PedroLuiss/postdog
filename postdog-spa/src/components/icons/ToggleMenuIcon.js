const MenuToggleIcon = ({ 
    size = 20, 
    color = 'currentColor',
    ...props
 }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" {...props}>
            <path d="M0 20H20V16.6667H0V20ZM0 11.6667H20V8.33333H0V11.6667ZM0 0V3.33333H20V0H0Z" fill={color}/>
        </svg>
    );
}

export default MenuToggleIcon;
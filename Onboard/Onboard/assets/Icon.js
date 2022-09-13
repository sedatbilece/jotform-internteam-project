const ArrowIcon = ({ size, color, classname }) => {
    return (
        <div className={classname}>
            <svg width="84" height="42" viewBox="0 0 84 42" fill={color} xmlns="http://www.w3.org/2000/svg" className='icon'>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M27.4589 8.78448L37.9318 1.3038C40.3657 -0.434683 43.6353 -0.434683 46.0692 1.3038L56.5421 8.78448C61.2909 12.1765 66.9809 13.9999 72.8168 13.9999H84.0005L84.0005 41.9999H0.000488202L0.000488255 13.9999H11.1842C17.0201 13.9999 22.7101 12.1765 27.4589 8.78448Z" fill={color} />
            </svg>
        </div>
    )
}

const Icon = ({ size = 24, name, color, classname }) => {
    const icons = {
        arrow: ArrowIcon,
    }
    const Component = icons[name];
    return <Component size={size} color={color} classname={classname} />
}

export default Icon
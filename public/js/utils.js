const debounce = (func) => {
    let timer
    return (event) => {
        if (timer) { clearTimeout(timer) }
        timer = setTimeout(func, 35, event)
    }
}
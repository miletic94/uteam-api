const checkRegex = (regex: RegExp, text:string) => {
    return regex.test(text)
}

export { checkRegex }
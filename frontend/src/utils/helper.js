export const userDetailFromToken = (token) => {
    const data = JSON.parse(window.atob(token.split('.')[1]))
    console.log(data)
    return data
}
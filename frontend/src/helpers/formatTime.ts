export interface formatTimeTypes {
    timer: number
}

export function formatTime ({ timer }: formatTimeTypes) {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = Math.floor(timer / 60)
    const getMinutes = `0${minutes % 60}`.slice(-2)

    return `${getMinutes} : ${getSeconds}`
}
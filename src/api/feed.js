import { HOST } from 'api/config'
import { getEvents } from 'api/shared'

export function getFeed() {
    const url = HOST + '/event'
    return getEvents(url)
}

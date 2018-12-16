import { ERR_FREE, ERR_OK } from './config'
export const success = function(status) {
	if(window.useCloud) {
		return status === ERR_FREE
	} else {
		return status === ERR_OK
	}
}
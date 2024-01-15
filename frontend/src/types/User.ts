interface IUser {
	id: number,
	nickname: string,
	user42: string
	avatar: string
	created_at:string
	status?:string
	connection_state:string
	experience_points?:number
}

export default IUser
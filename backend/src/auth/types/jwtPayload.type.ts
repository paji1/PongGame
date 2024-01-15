export type JwtPayload = {
	user42: string;
	sub: number;
	isIntraAuth?: boolean;
	is2FA?: boolean;
	is2FAuth?: boolean;
};

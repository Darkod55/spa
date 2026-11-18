export type ClickType = "phone" | "email" | "address" | "social";

export type Attribution = {
	visitor_id: string;
	source: string;
	medium: string;
	campaign: string;
	journey: string;
};

export type ClickEvent = Attribution & {
	time: string;
	event: ClickType;
	value: string;
	location: string;
	page: string;
	ip: string;
};

export type SubmissionEvent = Attribution & {
	time: string;
	event: "submission";
	page: string;
	ip: string;
	name: string;
	email: string;
	organisation: string;
	phone: string;
	service: string;
	message: string;
};

export type AnalyticsReport = {
	from: string | null;
	to: string | null;
	limit: number;
	included: string[];
	clicks?: ClickEvent[];
	submissions?: SubmissionEvent[];
};

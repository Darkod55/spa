export type TeamMember = {
	slug: string;
	name: string;
	role: string;
	bio: string;
	/** When true, omitted from the About team grid (entry kept for later). */
	hidden?: boolean;
};

/** About page team — order is deliberate (grid fill order). */
export const team: TeamMember[] = [
	{
		slug: "mandy",
		name: "Mandy",
		role: "Founder and Chief Executive Officer",
		bio: "Mandy leads SPA's strategy and direction, working closely with clients to understand their business, identify opportunities and shape marketing that supports where they want to go. She oversees the agency's strategic work while keeping a close eye on standards, ideas and delivery.",
	},
	{
		slug: "darko",
		name: "Darko",
		role: "Chief Technology Officer",
		bio: "Darko is a PHP, Laravel and WordPress developer with over a decade of experience building websites and web applications. He leads SPA's technology and development, finding practical solutions to complex problems and making sure everything we build works as well as it looks.",
	},
	{
		slug: "kyle",
		name: "Kyle",
		role: "Project Coordinator",
		bio: "Kyle works alongside Alexandra to coordinate projects, track tasks and deadlines, and manage the moving parts involved in delivering client work. He helps keep communication clear, work organised, and projects progressing smoothly from one stage to the next.",
	},
	{
		slug: "graphic-designer",
		name: "[Name]",
		role: "Graphic Designer",
		bio: "[Name] turns ideas into strong visual imagery across digital and print. From social content and campaign assets to websites, publications and wider brand applications, the focus is always on design that communicates clearly and feels cohesive.",
		hidden: true,
	},
	{
		slug: "niall",
		name: "Niall",
		role: "PPC Specialist",
		bio: "Niall leads paid search and PPC, using data, audience insight and continual optimisation to make advertising budgets work harder. He focuses on reaching the right people at the right time and turning paid activity into measurable business results.",
	},
	{
		slug: "marco",
		name: "Marco",
		role: "Videographer",
		bio: "Marco creates video content that helps brands communicate with personality and purpose. From interviews and social content to campaign and brand video, he combines creative storytelling with a strong understanding of what footage needs to achieve once it leaves the edit.",
	},
];

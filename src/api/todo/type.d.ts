namespace TODO {
	type GetTodoResponse = {
		id: number;
		title: string;
		description: string;
		completed: boolean;
		category: string;
		dueDate: string;
		createdAt: string;
		tags: Array<string>;
		image: string;
	}[];
	type GetTodoRequest = void;

	type DeleteTodoRes = void;
	type DeleteTodoReq = number;
}

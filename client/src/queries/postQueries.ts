import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
	query GetAllPosts {
		getAllPost {
			_id
			caption
			createdAt
			file
			likes
			location
			tags
			userId
		}
	}
`;
